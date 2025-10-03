# Model Configuration Update

**Date:** 2025-01-02
**Change:** Updated SDK to reflect current production models

---

## ✅ Changes Made

### 1. Documentation Updated

**Files modified:**
- `README.md` - Updated to show only GPT-5 and Claude Opus 4.1
- `examples/README.md` - Added model selection guidance
- `CHANGELOG.md` - Added dual model support feature
- `MODELS.md` - **NEW** Comprehensive model guide

### 2. New Files Created

**`MODELS.md`** - Complete model documentation including:
- Model specifications (GPT-5 & Claude Opus 4.1)
- Usage examples for each model
- Parameter descriptions
- Model selection guide
- Comparison instructions
- Future roadmap

**`examples/model-comparison.ts`** - **NEW** Example showing:
- Side-by-side model comparison
- Branch usage for A/B testing
- How to compare responses

---

## 📊 Current Production Models

| Model ID | Provider | Status | Streaming | Context |
|----------|----------|--------|-----------|---------|
| `gpt-5` | OpenAI | ✅ Active | ✅ Yes | Large |
| `claude-opus-4-1` | Anthropic | ✅ Active | ✅ Yes | Extended |

**Total Active Models:** 2

---

## 🔧 Model Usage in SDK

### Basic Usage

```typescript
// GPT-5
const response = await client.messages.send(conversationId, {
  content: 'Your prompt',
  model: 'gpt-5'
});

// Claude Opus 4.1
const response = await client.messages.send(conversationId, {
  content: 'Your prompt',
  model: 'claude-opus-4-1'
});
```

### A/B Testing Models

```typescript
// Use branching to compare models
const gptResponse = await client.messages.send(conv.id, {
  content: 'Test prompt',
  model: 'gpt-5'
});

const branch = await client.branches.fork(conv.id, {
  forkPointMessageId: gptResponse.userMessage.id,
  title: 'Claude Comparison'
});

const claudeResponse = await client.messages.send(conv.id, {
  content: 'Test prompt',
  model: 'claude-opus-4-1',
  branchId: branch.id
});
```

---

## 📝 Documentation References

For users, point them to:
1. **`README.md`** - Quick model overview
2. **`MODELS.md`** - Detailed model guide
3. **`examples/model-comparison.ts`** - Working comparison example

---

## 🔮 Future Models

SDK is designed to support additional models when they become available:
- Model validation in SDK will automatically support new models from API
- No SDK changes needed when new models are added server-side
- Documentation will be updated to reflect new models

---

## ✅ Validation Checklist

- [x] README.md updated with current models
- [x] Examples updated to show both models
- [x] MODELS.md created with comprehensive guide
- [x] Model comparison example added
- [x] CHANGELOG.md updated
- [x] No hardcoded model lists (flexible for future)

---

## 🚀 Impact on Publishing

**No breaking changes** - This is a documentation update only.

The SDK already supports:
- ✅ Any model string as parameter
- ✅ Server-side validation
- ✅ Error handling for invalid models

Users can now:
- ✅ Understand which models are available
- ✅ Choose the right model for their use case
- ✅ Compare models side-by-side using branches

---

**This update clarifies the current production environment without affecting SDK functionality.**
