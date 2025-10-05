# TypeScript SDK Update - 2025-10-05

**Date:** October 5, 2025
**SDK Version:** 0.1.0
**Type:** Critical Bug Fixes & API Alignment

---

## Overview

This update fixes critical API response format mismatches between the TypeScript SDK and the ChatRoutes API. The SDK was expecting incorrect response formats that didn't match the actual API responses, causing runtime errors and type mismatches.

These fixes mirror the corrections previously applied to the Python SDK on the same date.

---

## Issues Fixed

### 1. Send Message Response Format ✅

**Problem:**
SDK expected `{userMessage: {...}, assistantMessage: {...}}` but API returns `{message: {...}, usage: {...}, model: '...'}`

**Files Changed:**
- `src/types.ts` - Updated `SendMessageResponse` interface
- `src/api/messages.ts` - Added validation for new response format
- `src/index.ts` - Added `UsageStats` export

**Old Type:**
```typescript
export interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
}
```

**New Type:**
```typescript
export interface UsageStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface SendMessageResponse {
  message: Message;      // AI response only
  usage: UsageStats;     // Token usage stats
  model: string;         // Model used
}
```

**Migration:**
```typescript
// OLD
const response = await client.messages.send(conversationId, {...});
console.log(response.assistantMessage.content);

// NEW
const response = await client.messages.send(conversationId, {...});
console.log(response.message.content);
console.log(response.usage.totalTokens);
console.log(response.model);
```

---

### 2. Streaming Response Format ✅

**Problem:**
SDK expected OpenAI-style format `{choices: [{delta: {content: '...'}}]}` but API uses ChatRoutes format `{type: 'content', content: '...'}` or `{type: 'complete', message: {...}}`

**Files Changed:**
- `src/types.ts` - Updated `StreamChunk` interface
- `src/api/messages.ts` - Updated `stream()` method to handle new format

**Old Type:**
```typescript
export interface StreamChunk {
  id: string;
  model: string;
  choices: Array<{
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason?: string;
    index: number;
  }>;
  created: number;
}
```

**New Type:**
```typescript
export interface StreamChunk {
  type: 'content' | 'complete';
  content?: string;        // When type='content'
  model?: string;          // When type='complete'
  message?: Message;       // When type='complete'
  usage?: UsageStats;      // When type='complete'
}
```

**Migration:**
```typescript
// OLD
await client.messages.stream(conversationId, {...}, (chunk) => {
  if (chunk.choices?.[0]?.delta?.content) {
    process.stdout.write(chunk.choices[0].delta.content);
  }
});

// NEW
await client.messages.stream(conversationId, {...}, (chunk) => {
  if (chunk.type === 'content' && chunk.content) {
    process.stdout.write(chunk.content);
  }
});
```

---

### 3. Conversations List Response Format ✅

**Problem:**
SDK expected `{success: true, data: {conversations: [...]}}` but API returns `{conversations: [...], total: number, page: number, limit: number}` directly

**Files Changed:**
- `src/api/conversations.ts` - Updated `list()` method

**Old Implementation:**
```typescript
if (!response.success || !response.data) {
  throw new Error(response.message || 'Failed to list conversations');
}

return {
  data: response.data.conversations,
  total: response.data.total,
  // ...
};
```

**New Implementation:**
```typescript
if (response.data && 'conversations' in response.data) {
  return {
    data: response.data.conversations,
    total: response.data.total,
    page: response.data.page,
    limit: response.data.limit,
  };
}

throw new Error('Failed to list conversations');
```

---

### 4. Conversation Tree Response Structure ✅

**Problem:**
SDK types suggested `tree.metadata.totalNodes` but API returns `{conversation: {...}, branches: [...], mainBranch: {...}}`

**Files Changed:**
- `src/types.ts` - Updated `ConversationTree` interface
- `src/api/conversations.ts` - No changes needed (already correct)

**Old Type:**
```typescript
export interface ConversationTree {
  conversation: Conversation;
  tree: TreeNode;
  metadata: {
    totalNodes: number;
    totalBranches: number;
    maxDepth: number;
  };
}

export interface TreeNode {
  id: string;
  content: string;
  role: string;
  children: TreeNode[];
  branchInfo?: {
    branchId: string;
    branchName: string;
  };
}
```

**New Type:**
```typescript
export interface ConversationTree {
  conversation: Conversation;
  branches: Branch[];
  mainBranch: Branch;
}
```

**Migration:**
```typescript
// OLD
const tree = await client.conversations.getTree(conversationId);
console.log(tree.metadata.totalNodes);

// NEW
const tree = await client.conversations.getTree(conversationId);
console.log('Conversation:', tree.conversation.title);
console.log('Total branches:', tree.branches.length);
console.log('Main branch:', tree.mainBranch.title);
```

---

### 5. Supported Models Documentation ✅

**Problem:**
Documentation listed `claude-sonnet-4` which doesn't exist

**Files Changed:**
- `MODELS.md` - Updated with correct model list
- `README.md` - Updated examples with correct usage

**Incorrect Models Removed:**
- ❌ `claude-sonnet-4` (doesn't exist)

**Correct Model List:**

**OpenAI:**
- `gpt-5`

**Claude 4 Series:**
- `claude-opus-4-1`
- `claude-opus-4`
- `claude-opus-4-0`
- `claude-sonnet-4-5`
- `claude-sonnet-4-0`

**Claude 3 Series:**
- `claude-3-7-sonnet-latest`
- `claude-3-5-haiku-latest`

---

## Examples Updated

All example files have been updated to use the correct response format:

### 1. `examples/basic-chat.ts`
```typescript
// OLD
console.log('\n📝 User:', response.userMessage.content);
console.log('\n🤖 Assistant:', response.assistantMessage.content);
console.log('\n📊 Tokens used:', response.assistantMessage.tokenCount);

// NEW
console.log('\n🤖 Assistant:', response.message.content);
console.log('\n📊 Model:', response.model);
console.log('\n📊 Usage:', response.usage);
```

### 2. `examples/streaming-chat.ts`
```typescript
// OLD
(chunk) => {
  if (chunk.choices?.[0]?.delta?.content) {
    process.stdout.write(chunk.choices[0].delta.content);
  }
}

// NEW
(chunk) => {
  if (chunk.type === 'content' && chunk.content) {
    process.stdout.write(chunk.content);
  }
}
```

### 3. `examples/branching.ts`
```typescript
// OLD
forkPointMessageId: response.assistantMessage.id
console.log(`  - Total nodes: ${tree.metadata.totalNodes}`);

// NEW
forkPointMessageId: response.message.id
console.log(`  - Total branches: ${tree.branches.length}`);
```

### 4. `examples/model-comparison.ts`
```typescript
// OLD
console.log(gptResponse.assistantMessage.content);
console.log(`📊 Tokens: ${gptResponse.assistantMessage.tokenCount}`);

// NEW
console.log(gptResponse.message.content);
console.log(`📊 Tokens: ${gptResponse.usage.totalTokens}`);
```

---

## Files Modified

### Type Definitions
- ✅ `src/types.ts` - Updated `SendMessageResponse`, `StreamChunk`, `ConversationTree`, added `UsageStats`
- ✅ `src/index.ts` - Updated exports, removed `TreeNode`, added `UsageStats`

### API Implementation
- ✅ `src/api/messages.ts` - Updated `send()` and `stream()` methods
- ✅ `src/api/conversations.ts` - Updated `list()` method

### Examples
- ✅ `examples/basic-chat.ts`
- ✅ `examples/streaming-chat.ts`
- ✅ `examples/branching.ts`
- ✅ `examples/model-comparison.ts`

### Documentation
- ✅ `README.md` - Updated all code examples
- ✅ `MODELS.md` - Updated model list and examples

---

## Build & Compilation

✅ **TypeScript compilation successful**

```bash
npm run build
# ✅ CJS Build success in 23ms
# ✅ ESM Build success in 23ms
# ✅ DTS Build success in 530ms
```

All type definitions are correct and exports are working properly.

---

## Breaking Changes

⚠️ **This update contains breaking changes:**

1. **Message Response Format**
   - `response.userMessage` → No longer returned
   - `response.assistantMessage` → `response.message`
   - Added `response.usage` and `response.model`

2. **Stream Chunk Format**
   - `chunk.choices[0].delta.content` → `chunk.content` (when `chunk.type === 'content'`)
   - Added `chunk.type` discriminator field

3. **Conversation Tree Format**
   - `tree.metadata` → Removed
   - `tree.tree` → Removed
   - Added `tree.branches` and `tree.mainBranch`

4. **Model Names**
   - Removed invalid `claude-sonnet-4`
   - Use `claude-sonnet-4-5` or `claude-sonnet-4-0` instead

---

## Migration Guide

### For Send Messages

```typescript
// Before
const response = await client.messages.send(conversationId, {...});
const userMsg = response.userMessage;
const aiMsg = response.assistantMessage;
console.log(aiMsg.content);

// After
const response = await client.messages.send(conversationId, {...});
const aiMsg = response.message;
console.log(aiMsg.content);
console.log('Tokens:', response.usage.totalTokens);
console.log('Model:', response.model);
```

### For Streaming

```typescript
// Before
await client.messages.stream(conversationId, {...}, (chunk) => {
  if (chunk.choices?.[0]?.delta?.content) {
    process.stdout.write(chunk.choices[0].delta.content);
  }
}, (complete) => {
  console.log(complete.assistantMessage.content);
});

// After
await client.messages.stream(conversationId, {...}, (chunk) => {
  if (chunk.type === 'content' && chunk.content) {
    process.stdout.write(chunk.content);
  }
}, (complete) => {
  console.log(complete.message.content);
  console.log('Tokens:', complete.usage.totalTokens);
});
```

### For Conversation Tree

```typescript
// Before
const tree = await client.conversations.getTree(conversationId);
console.log(`Nodes: ${tree.metadata.totalNodes}`);
console.log(`Branches: ${tree.metadata.totalBranches}`);

// After
const tree = await client.conversations.getTree(conversationId);
console.log(`Branches: ${tree.branches.length}`);
console.log(`Main: ${tree.mainBranch.title}`);
```

### For Branching

```typescript
// Before
const response = await client.messages.send(conversationId, {...});
await client.branches.fork(conversationId, {
  forkPointMessageId: response.assistantMessage.id,
  ...
});

// After
const response = await client.messages.send(conversationId, {...});
await client.branches.fork(conversationId, {
  forkPointMessageId: response.message.id,
  ...
});
```

---

## Testing

### Manual Testing Checklist

- [ ] Send message returns correct format
- [ ] Streaming returns correct chunks
- [ ] Conversations list works without wrapper
- [ ] Conversation tree returns correct structure
- [ ] All models are valid
- [ ] Examples run without errors

### Automated Testing

Run the test suite to verify all changes:

```bash
npm test
```

---

## Next Steps

1. **Update SDK version** to 0.2.0 (breaking changes)
2. **Publish to npm** with changelog
3. **Update dependent projects** to use new response format
4. **Add automated tests** for response format validation

---

## Support

If you encounter issues after this update:

1. Check this migration guide
2. Review updated examples in `examples/` directory
3. Consult `MODELS.md` for correct model names
4. Contact support@chatroutes.com

---

**Summary:** This update aligns the TypeScript SDK with the actual ChatRoutes API response formats, ensuring type safety and preventing runtime errors. All response format mismatches have been corrected to match the API's actual behavior.
