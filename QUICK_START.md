# Quick Start - ChatRoutes SDK

**5-Minute Setup Guide**

---

## 🚀 Fastest Way to Publish

### Step 1: Test Build (2 minutes)

```bash
cd C:\Users\afzal\chatroutes\chatroutes-sdk
npm install
npm run build
npm run lint
```

✅ **Expected:** No errors, `dist/` folder created

### Step 2: Create GitHub Repo (1 minute)

1. Go to https://github.com/chatroutes
2. Click "New repository"
3. Name: `chatroutes-sdk`
4. Public, no initialize
5. Create

### Step 3: Push Code (1 minute)

```bash
git remote add origin https://github.com/chatroutes/chatroutes-sdk.git
git add .
git commit -m "feat: initial SDK v0.1.0"
git push -u origin main
```

### Step 4: Publish to npm (1 minute)

**Option A: Quick (Manual)**
```bash
npm login
npm publish --access public
```

**Option B: Automated (Recommended)**
1. Get npm token from npmjs.com
2. Add `NPM_TOKEN` to GitHub Secrets
3. Create GitHub Release: v0.1.0
4. Auto-publishes!

---

## ✅ Done!

Your SDK is now live at:
- 📦 **npm:** https://npmjs.com/package/@chatroutes/sdk
- 🐙 **GitHub:** https://github.com/chatroutes/chatroutes-sdk

Install with:
```bash
npm install @chatroutes/sdk
```

---

## 📚 Full Guides

- **Complete Setup:** `SETUP_INSTRUCTIONS.md`
- **Testing:** `TESTING_GUIDE.md`
- **Progress:** `SDK_PROGRESS.md`
- **Session Summary:** `../SDK_SESSION_SUMMARY.md`

---

## 🧪 Test Locally First (Optional)

```bash
# Create test package
npm pack

# Test in new project
mkdir test-project && cd test-project
npm init -y
npm install ../chatroutes-sdk-0.1.0.tgz

# Verify it works
node -e "const { ChatRoutesClient } = require('@chatroutes/sdk'); console.log('✅ Works!');"
```

---

## 🆘 Need Help?

Read: `SETUP_INSTRUCTIONS.md` for detailed steps
Email: support@chatroutes.com
