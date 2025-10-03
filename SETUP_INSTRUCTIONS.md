# Setup Instructions - ChatRoutes SDK

**Created:** 2025-01-02
**Location:** `C:\Users\afzal\chatroutes\chatroutes-sdk`

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd C:\Users\afzal\chatroutes\chatroutes-sdk
npm install
```

**Expected output:** Dependencies installed successfully.

### Step 2: Build the SDK

```bash
npm run build
```

**Expected output:**
- `dist/` folder created
- `dist/index.js`, `dist/index.mjs`, `dist/index.d.ts` files

### Step 3: Run Quality Checks

```bash
npm run lint
npm run typecheck
```

**Expected output:** No errors.

### Step 4: Test with Real API (Optional)

Create `.env` file:
```bash
echo CHATROUTES_API_KEY=your_api_key_here > .env
```

Run example:
```bash
npx tsx examples/basic-chat.ts
```

---

## 📦 Publishing to npm (First Time)

### Prerequisites

1. **Create npm Account**
   - Go to https://npmjs.com
   - Sign up for free account
   - Verify email

2. **Login to npm**
   ```bash
   npm login
   ```
   Enter your npm username, password, and email.

3. **Verify Login**
   ```bash
   npm whoami
   ```

### Publishing Steps

#### Option A: Manual Publish (Testing)

```bash
# Make sure build works
npm run build

# Make sure tests pass (if any)
npm test

# Publish to npm
npm publish --access public
```

**Package will be available at:**
- https://www.npmjs.com/package/@chatroutes/sdk
- Install with: `npm install @chatroutes/sdk`

#### Option B: Automated Publish (Recommended)

1. **Create GitHub Repository**
   ```bash
   # In the chatroutes-sdk directory
   git add .
   git commit -m "feat: initial SDK implementation (v0.1.0)"

   # Create repo on GitHub first: https://github.com/chatroutes/chatroutes-sdk
   git remote add origin https://github.com/chatroutes/chatroutes-sdk.git
   git push -u origin main
   ```

2. **Get npm Token**
   - Go to npmjs.com → Account → Access Tokens
   - Click "Generate New Token"
   - Choose "Automation" type
   - Copy the token (starts with `npm_`)

3. **Add npm Token to GitHub**
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click "Add secret"

4. **Create GitHub Release**
   - Go to GitHub repo → Releases → Create new release
   - Tag: `v0.1.0`
   - Title: `v0.1.0 - Initial Beta Release`
   - Description: Copy from CHANGELOG.md
   - Click "Publish release"

5. **Automatic Publishing**
   - GitHub Actions will automatically run
   - Builds, tests, and publishes to npm
   - Check Actions tab for progress

---

## 🐙 GitHub Setup

### Create Organization Repository

1. **Create Repo on GitHub**
   - Go to https://github.com/chatroutes
   - Click "New repository"
   - Name: `chatroutes-sdk`
   - Description: "Official TypeScript/JavaScript SDK for ChatRoutes"
   - Public
   - Don't initialize with README (we have one)
   - Create repository

2. **Push Code**
   ```bash
   cd C:\Users\afzal\chatroutes\chatroutes-sdk
   git remote add origin https://github.com/chatroutes/chatroutes-sdk.git
   git branch -M main
   git push -u origin main
   ```

3. **Configure Repository**
   - Settings → General → Features
     - ✅ Issues
     - ✅ Projects
     - ✅ Discussions (optional)
   - Settings → Branches → Branch protection rules
     - Add rule for `main`
     - ✅ Require pull request reviews before merging
     - ✅ Require status checks to pass

4. **Add Topics**
   - Repository page → About gear icon
   - Topics: `chatroutes`, `sdk`, `typescript`, `javascript`, `ai`, `llm`, `conversation`, `branching`

---

## 🧪 Testing Before Release

### Manual Testing Checklist

- [ ] Build succeeds: `npm run build`
- [ ] Linting passes: `npm run lint`
- [ ] Type checking passes: `npm run typecheck`
- [ ] Package.json version is correct (0.1.0)
- [ ] README.md is complete and accurate
- [ ] LICENSE file is present
- [ ] Examples run without errors

### Test Installation Locally

```bash
# In the SDK directory
npm pack

# This creates chatroutes-sdk-0.1.0.tgz

# In a test project
mkdir test-sdk
cd test-sdk
npm init -y
npm install ../chatroutes-sdk/chatroutes-sdk-0.1.0.tgz

# Test import
node -e "const { ChatRoutesClient } = require('@chatroutes/sdk'); console.log('SDK loaded successfully');"
```

### Test with Real API

Create `test.js`:
```javascript
const { ChatRoutesClient } = require('@chatroutes/sdk');

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY
});

client.conversations.list()
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err));
```

Run:
```bash
CHATROUTES_API_KEY=your_key node test.js
```

---

## 📊 Post-Publishing Checklist

After publishing to npm:

- [ ] Verify package appears on npmjs.com
- [ ] Test installation: `npm install @chatroutes/sdk`
- [ ] Test in new project with TypeScript
- [ ] Test in new project with JavaScript
- [ ] Update chatroutes.com with SDK announcement
- [ ] Write blog post about SDK release
- [ ] Share on social media
- [ ] Monitor GitHub issues for bug reports

---

## 🔄 Updating to Future Versions

### For Bug Fixes (0.1.0 → 0.1.1)

```bash
# Fix the bug
# Update CHANGELOG.md
npm version patch
git push && git push --tags
# Create GitHub release for new tag
```

### For New Features (0.1.1 → 0.2.0)

```bash
# Add the feature
# Update CHANGELOG.md
npm version minor
git push && git push --tags
# Create GitHub release for new tag
```

### For Breaking Changes (0.2.0 → 1.0.0)

```bash
# Make breaking changes
# Update CHANGELOG.md with migration guide
npm version major
git push && git push --tags
# Create GitHub release for new tag
```

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clean and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### npm Publish Fails

```bash
# Check login
npm whoami

# Check package name availability
npm view @chatroutes/sdk

# Force publish (if needed)
npm publish --access public --force
```

### GitHub Actions Fails

- Check Actions tab for error logs
- Verify NPM_TOKEN secret is set
- Ensure package.json version is unique

---

## 📞 Need Help?

- **Documentation**: Read `SDK_PROGRESS.md` for complete status
- **Examples**: Check `examples/` directory
- **Issues**: Create issue on GitHub
- **Email**: support@chatroutes.com

---

**Next Steps:**
1. Run through this setup
2. Test locally
3. Publish to npm
4. Create GitHub repository
5. Monitor for issues
6. Start on Python SDK

**Good luck! 🚀**
