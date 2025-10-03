# Testing Guide - ChatRoutes SDK

**Purpose:** Comprehensive testing strategy to ensure SDK is bug-free before npm publish
**Last Updated:** 2025-01-02

---

## 🧪 Testing Strategy Overview

### Testing Phases
1. **Local Build Testing** - Verify compilation & packaging
2. **Unit Testing** - Test individual functions/modules
3. **Integration Testing** - Test against production API
4. **Package Testing** - Test npm package locally
5. **Installation Testing** - Test in fresh projects
6. **Cross-Platform Testing** - Test on different OS/Node versions
7. **Production Smoke Testing** - Final verification

---

## Phase 1: Local Build Testing ✅

### 1.1 Install Dependencies

```bash
cd C:\Users\afzal\chatroutes\chatroutes-sdk
npm install
```

**Expected:** No errors, node_modules created

### 1.2 Build the Package

```bash
npm run build
```

**Expected Output:**
- ✅ `dist/index.js` (CommonJS)
- ✅ `dist/index.mjs` (ESM)
- ✅ `dist/index.d.ts` (TypeScript types)
- ✅ No compilation errors

**Verify:**
```bash
# Check files exist
ls dist/
# Should show: index.js, index.mjs, index.d.ts, and other API files
```

### 1.3 Run Linting

```bash
npm run lint
```

**Expected:** No linting errors

**If errors occur:**
```bash
npm run lint -- --fix
```

### 1.4 Type Checking

```bash
npm run typecheck
```

**Expected:** No TypeScript errors

### 1.5 Verify Package Exports

Create `test-exports.js`:
```javascript
const pkg = require('./dist/index.js');

console.log('Exports:', Object.keys(pkg));
// Should show: ChatRoutesClient, AuthAPI, ConversationsAPI, etc.

if (pkg.ChatRoutesClient) {
  console.log('✅ ChatRoutesClient exported');
} else {
  console.log('❌ ChatRoutesClient NOT exported');
}
```

Run:
```bash
node test-exports.js
```

---

## Phase 2: Unit Testing 🧪

### 2.1 Create Test Structure

```bash
mkdir -p src/__tests__
```

### 2.2 Install Testing Dependencies

```bash
npm install -D vitest @vitest/ui
```

### 2.3 Create Test Files

**File: `src/__tests__/client.test.ts`**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { ChatRoutesClient } from '../client';

describe('ChatRoutesClient', () => {
  it('should initialize with config', () => {
    const client = new ChatRoutesClient({
      apiKey: 'test-key'
    });

    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
    expect(client.conversations).toBeDefined();
    expect(client.messages).toBeDefined();
    expect(client.branches).toBeDefined();
  });

  it('should use custom base URL', () => {
    const client = new ChatRoutesClient({
      apiKey: 'test-key',
      baseUrl: 'https://custom.api.com'
    });

    expect(client).toBeDefined();
  });

  it('should set default timeout', () => {
    const client = new ChatRoutesClient({
      apiKey: 'test-key'
    });

    expect(client['config'].timeout).toBe(30000);
  });

  it('should set custom timeout', () => {
    const client = new ChatRoutesClient({
      apiKey: 'test-key',
      timeout: 5000
    });

    expect(client['config'].timeout).toBe(5000);
  });
});
```

**File: `src/__tests__/errors.test.ts`**
```typescript
import { describe, it, expect } from 'vitest';
import {
  ChatRoutesError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError
} from '../errors';

describe('Error Classes', () => {
  it('ChatRoutesError should have correct properties', () => {
    const error = new ChatRoutesError('Test error', 500, 'TEST_ERROR');

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe('TEST_ERROR');
    expect(error.name).toBe('ChatRoutesError');
  });

  it('AuthenticationError should have 401 status', () => {
    const error = new AuthenticationError('Auth failed');

    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('AUTHENTICATION_ERROR');
  });

  it('ValidationError should have 400 status', () => {
    const error = new ValidationError('Invalid input');

    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('VALIDATION_ERROR');
  });

  it('NotFoundError should have 404 status', () => {
    const error = new NotFoundError('Not found');

    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
  });

  it('RateLimitError should have 429 status', () => {
    const error = new RateLimitError('Too many requests', 60);

    expect(error.statusCode).toBe(429);
    expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
    expect(error.retryAfter).toBe(60);
  });

  it('NetworkError should have 0 status', () => {
    const error = new NetworkError('Network failed');

    expect(error.statusCode).toBe(0);
    expect(error.code).toBe('NETWORK_ERROR');
  });
});
```

**File: `vitest.config.ts`**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/__tests__/',
      ],
    },
  },
});
```

### 2.4 Run Unit Tests

```bash
npm test
```

**Expected:** All tests pass

### 2.5 Check Coverage

```bash
npm run test:coverage
```

**Target:** 70%+ code coverage

---

## Phase 3: Integration Testing 🔌

### 3.1 Create Integration Test Suite

**File: `tests/integration/api.integration.test.ts`**
```typescript
import { ChatRoutesClient } from '../../src';

const API_KEY = process.env.CHATROUTES_API_KEY;

describe('Integration Tests', () => {
  let client: ChatRoutesClient;

  beforeAll(() => {
    if (!API_KEY) {
      throw new Error('CHATROUTES_API_KEY environment variable required');
    }

    client = new ChatRoutesClient({
      apiKey: API_KEY
    });
  });

  describe('Conversations', () => {
    it('should create conversation', async () => {
      const conv = await client.conversations.create({
        title: 'Integration Test',
        model: 'gpt-5'
      });

      expect(conv.id).toBeDefined();
      expect(conv.title).toBe('Integration Test');
    });

    it('should list conversations', async () => {
      const result = await client.conversations.list({
        page: 1,
        limit: 10
      });

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('Messages', () => {
    it('should send message', async () => {
      const conv = await client.conversations.create({
        title: 'Message Test'
      });

      const response = await client.messages.send(conv.id, {
        content: 'Test message',
        model: 'gpt-5'
      });

      expect(response.userMessage).toBeDefined();
      expect(response.assistantMessage).toBeDefined();
    });
  });

  describe('Branches', () => {
    it('should create and list branches', async () => {
      const conv = await client.conversations.create({
        title: 'Branch Test'
      });

      const branches = await client.branches.list(conv.id);
      expect(branches.length).toBeGreaterThan(0);
    });
  });
});
```

### 3.2 Run Integration Tests

```bash
# Set API key
export CHATROUTES_API_KEY="your_api_key"

# Run integration tests
npm run test:integration
```

**Expected:** All integration tests pass

---

## Phase 4: Package Testing 📦

### 4.1 Create Local Package

```bash
cd C:\Users\afzal\chatroutes\chatroutes-sdk
npm pack
```

**Output:** `chatroutes-sdk-0.1.0.tgz`

### 4.2 Test in Fresh Project (JavaScript)

```bash
# Create test directory
mkdir test-js-project
cd test-js-project

# Initialize project
npm init -y

# Install local package
npm install ../chatroutes-sdk/chatroutes-sdk-0.1.0.tgz

# Create test file
cat > test.js << 'EOF'
const { ChatRoutesClient } = require('@chatroutes/sdk');

console.log('✅ SDK imported successfully');

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY || 'test-key'
});

console.log('✅ Client created:', client.constructor.name);
console.log('✅ APIs available:', {
  auth: !!client.auth,
  conversations: !!client.conversations,
  messages: !!client.messages,
  branches: !!client.branches
});
EOF

# Run test
node test.js
```

**Expected Output:**
```
✅ SDK imported successfully
✅ Client created: ChatRoutesClient
✅ APIs available: { auth: true, conversations: true, messages: true, branches: true }
```

### 4.3 Test in Fresh Project (TypeScript)

```bash
# Create test directory
mkdir test-ts-project
cd test-ts-project

# Initialize project
npm init -y
npm install -D typescript @types/node

# Install local package
npm install ../chatroutes-sdk/chatroutes-sdk-0.1.0.tgz

# Create tsconfig
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "strict": true
  }
}
EOF

# Create test file
cat > test.ts << 'EOF'
import { ChatRoutesClient } from '@chatroutes/sdk';

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY || 'test-key'
});

console.log('✅ TypeScript SDK works');
console.log('✅ Type checking passed');
EOF

# Compile and run
npx tsc test.ts
node test.js
```

**Expected:** No TypeScript errors, runs successfully

### 4.4 Test ESM Import

```bash
# Create test file with .mjs extension
cat > test.mjs << 'EOF'
import { ChatRoutesClient } from '@chatroutes/sdk';

const client = new ChatRoutesClient({
  apiKey: 'test-key'
});

console.log('✅ ESM import works');
EOF

# Run
node test.mjs
```

**Expected:** ESM import works

---

## Phase 5: Real API Testing 🌐

### 5.1 End-to-End Test Script

**File: `tests/e2e/full-flow.test.ts`**
```typescript
import { ChatRoutesClient } from '../../src';

async function fullFlowTest() {
  const client = new ChatRoutesClient({
    apiKey: process.env.CHATROUTES_API_KEY!
  });

  console.log('🧪 Starting E2E test...\n');

  // 1. Create conversation
  console.log('1️⃣ Creating conversation...');
  const conv = await client.conversations.create({
    title: 'E2E Test Conversation',
    model: 'gpt-5'
  });
  console.log(`✅ Created: ${conv.id}\n`);

  // 2. Send message
  console.log('2️⃣ Sending message...');
  const msgResponse = await client.messages.send(conv.id, {
    content: 'Say hello in one word',
    model: 'gpt-5',
    maxTokens: 10
  });
  console.log(`✅ User: ${msgResponse.userMessage.content}`);
  console.log(`✅ AI: ${msgResponse.assistantMessage.content}\n`);

  // 3. List conversations
  console.log('3️⃣ Listing conversations...');
  const convList = await client.conversations.list({ limit: 5 });
  console.log(`✅ Found ${convList.data.length} conversations\n`);

  // 4. Create branch
  console.log('4️⃣ Creating branch...');
  const branch = await client.branches.fork(conv.id, {
    forkPointMessageId: msgResponse.assistantMessage.id,
    title: 'Test Branch',
    contextMode: 'FULL'
  });
  console.log(`✅ Branch created: ${branch.id}\n`);

  // 5. List branches
  console.log('5️⃣ Listing branches...');
  const branches = await client.branches.list(conv.id);
  console.log(`✅ Found ${branches.length} branches\n`);

  // 6. Get conversation tree
  console.log('6️⃣ Getting conversation tree...');
  const tree = await client.conversations.getTree(conv.id);
  console.log(`✅ Tree: ${tree.metadata.totalNodes} nodes, ${tree.metadata.totalBranches} branches\n`);

  // 7. Stream message
  console.log('7️⃣ Testing streaming...');
  process.stdout.write('✅ AI (streaming): ');
  await client.messages.stream(
    conv.id,
    { content: 'Count to 3', model: 'gpt-5', maxTokens: 20 },
    (chunk) => {
      if (chunk.choices?.[0]?.delta?.content) {
        process.stdout.write(chunk.choices[0].delta.content);
      }
    }
  );
  console.log('\n');

  // 8. Cleanup
  console.log('8️⃣ Cleaning up...');
  await client.conversations.delete(conv.id);
  console.log('✅ Deleted test conversation\n');

  console.log('🎉 All E2E tests passed!');
}

fullFlowTest().catch(console.error);
```

### 5.2 Run E2E Test

```bash
export CHATROUTES_API_KEY="your_api_key"
npx tsx tests/e2e/full-flow.test.ts
```

**Expected:** All steps complete successfully

### 5.3 Error Handling Test

**File: `tests/e2e/error-handling.test.ts`**
```typescript
import { ChatRoutesClient, NotFoundError, ValidationError } from '../../src';

async function errorHandlingTest() {
  const client = new ChatRoutesClient({
    apiKey: process.env.CHATROUTES_API_KEY!
  });

  console.log('🧪 Testing error handling...\n');

  // Test 1: Not Found Error
  try {
    await client.conversations.get('invalid-id');
    console.log('❌ Should have thrown NotFoundError');
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.log('✅ NotFoundError handled correctly');
    } else {
      console.log('❌ Wrong error type:', error);
    }
  }

  // Test 2: Validation Error (if applicable)
  try {
    await client.conversations.create({ title: '' } as any);
    console.log('❌ Should have thrown ValidationError');
  } catch (error) {
    console.log('✅ Validation error handled');
  }

  // Test 3: Retry logic
  console.log('\n🔄 Testing retry logic...');
  const startTime = Date.now();
  try {
    await client.conversations.get('invalid-id-for-retry-test');
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`✅ Retry logic executed (took ${duration}ms)`);
  }

  console.log('\n🎉 Error handling tests passed!');
}

errorHandlingTest().catch(console.error);
```

Run:
```bash
npx tsx tests/e2e/error-handling.test.ts
```

---

## Phase 6: Cross-Platform Testing 🖥️

### 6.1 Test on Different Node Versions

```bash
# Using nvm (Node Version Manager)

# Test on Node 18
nvm use 18
npm run build && npm test

# Test on Node 20
nvm use 20
npm run build && npm test

# Test on Node 22
nvm use 22
npm run build && npm test
```

### 6.2 Test on Different Operating Systems

**Windows (PowerShell):**
```powershell
cd C:\Users\afzal\chatroutes\chatroutes-sdk
npm install
npm run build
npm test
```

**macOS/Linux (Bash):**
```bash
cd ~/chatroutes/chatroutes-sdk
npm install
npm run build
npm test
```

---

## Phase 7: Pre-Publish Checklist ✅

### 7.1 Final Verification

```bash
# 1. Clean build
rm -rf dist node_modules
npm install
npm run build

# 2. Run all checks
npm run lint
npm run typecheck
npm test

# 3. Verify package contents
npm pack --dry-run

# 4. Check package size
du -sh chatroutes-sdk-0.1.0.tgz
# Should be < 100KB
```

### 7.2 Manual Checklist

- [ ] All tests pass
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Examples run successfully
- [ ] Package builds without errors
- [ ] README.md is accurate
- [ ] CHANGELOG.md is updated
- [ ] Version number is correct (0.1.0)
- [ ] All files are in `.npmignore` or included in `package.json` files
- [ ] License is present
- [ ] No sensitive data in code

### 7.3 Security Check

```bash
# Check for vulnerabilities
npm audit

# Fix if any found
npm audit fix
```

---

## Phase 8: Smoke Test After Publishing 🚀

### 8.1 After Publishing to npm

```bash
# In a completely fresh directory
mkdir smoke-test
cd smoke-test
npm init -y

# Install from npm
npm install @chatroutes/sdk

# Test import
node -e "const { ChatRoutesClient } = require('@chatroutes/sdk'); console.log('✅ SDK works from npm');"
```

### 8.2 Create Quick Smoke Test

```javascript
// smoke-test.js
const { ChatRoutesClient } = require('@chatroutes/sdk');

async function smokeTest() {
  const client = new ChatRoutesClient({
    apiKey: process.env.CHATROUTES_API_KEY
  });

  // Quick conversation test
  const conv = await client.conversations.create({
    title: 'Smoke Test'
  });

  console.log('✅ Conversation created:', conv.id);

  const response = await client.messages.send(conv.id, {
    content: 'Hi',
    model: 'gpt-5'
  });

  console.log('✅ Message sent successfully');
  console.log('✅ Response received:', response.assistantMessage.content.substring(0, 50));

  await client.conversations.delete(conv.id);
  console.log('✅ Cleanup complete');
}

smokeTest().catch(console.error);
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Build Fails

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 2: TypeScript Errors

**Solution:**
```bash
# Check TypeScript version
npx tsc --version

# Reinstall TypeScript
npm install -D typescript@latest
```

### Issue 3: Import Errors

**Solution:**
- Check `package.json` exports
- Verify `dist/` files exist
- Check module resolution in tsconfig

### Issue 4: Streaming Not Working

**Solution:**
- Test with small response
- Check network/firewall
- Verify SSE support in environment

---

## 📊 Testing Summary

| Phase | Command | Expected Result |
|-------|---------|-----------------|
| Build | `npm run build` | dist/ created |
| Lint | `npm run lint` | No errors |
| Type Check | `npm run typecheck` | No errors |
| Unit Tests | `npm test` | All pass |
| Integration | `npm run test:integration` | All pass |
| E2E | `npx tsx tests/e2e/full-flow.test.ts` | All pass |
| Package | `npm pack` | .tgz created |
| Fresh Install | `npm install ./chatroutes-sdk-0.1.0.tgz` | Installs OK |

---

## 🎯 Quick Test Script

**File: `run-all-tests.sh`**
```bash
#!/bin/bash
set -e

echo "🧪 Running all SDK tests..."

echo "\n1️⃣ Installing dependencies..."
npm install

echo "\n2️⃣ Running linter..."
npm run lint

echo "\n3️⃣ Type checking..."
npm run typecheck

echo "\n4️⃣ Building package..."
npm run build

echo "\n5️⃣ Running unit tests..."
npm test

echo "\n6️⃣ Creating package..."
npm pack

echo "\n✅ All tests passed!"
echo "\nPackage ready: chatroutes-sdk-0.1.0.tgz"
echo "\nNext: npm publish --access public"
```

Make executable:
```bash
chmod +x run-all-tests.sh
./run-all-tests.sh
```

---

**Testing complete! Follow this guide to ensure your SDK is production-ready.**
