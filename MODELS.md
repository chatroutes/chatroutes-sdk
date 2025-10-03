# Available AI Models

**Last Updated:** 2025-01-02
**SDK Version:** 0.1.0+

---

## Current Production Models

ChatRoutes currently supports **2 AI models** in production:

### 1. GPT-5 (OpenAI)
- **Model ID:** `gpt-5`
- **Provider:** OpenAI
- **Type:** Latest generation language model
- **Streaming:** ✅ Supported
- **Context:** Large context window
- **Best For:** General purpose, reasoning, code generation

**Example:**
```typescript
const response = await client.messages.send(conversationId, {
  content: 'Your prompt here',
  model: 'gpt-5',
  temperature: 0.7
});
```

### 2. Claude Opus 4.1 (Anthropic)
- **Model ID:** `claude-opus-4-1`
- **Provider:** Anthropic
- **Type:** Latest Claude flagship model
- **Streaming:** ✅ Supported
- **Context:** Extended context window
- **Best For:** Analysis, creative writing, detailed explanations

**Example:**
```typescript
const response = await client.messages.send(conversationId, {
  content: 'Your prompt here',
  model: 'claude-opus-4-1',
  temperature: 0.7
});
```

---

## Model Selection Guide

### When to use GPT-5
✅ General conversational AI
✅ Code generation and debugging
✅ Mathematical reasoning
✅ Fast responses needed
✅ Standard use cases

### When to use Claude Opus 4.1
✅ Long-form content analysis
✅ Creative writing and storytelling
✅ Detailed explanations
✅ Nuanced responses
✅ Complex reasoning tasks

---

## Comparing Models Side-by-Side

Use the model comparison example:

```bash
npx tsx examples/model-comparison.ts
```

Or create branches to compare:

```typescript
// Send to GPT-5
const gptResponse = await client.messages.send(conv.id, {
  content: 'Explain quantum computing',
  model: 'gpt-5'
});

// Create branch for Claude
const branch = await client.branches.fork(conv.id, {
  forkPointMessageId: gptResponse.userMessage.id,
  title: 'Claude Response'
});

// Send same prompt to Claude
const claudeResponse = await client.messages.send(conv.id, {
  content: 'Explain quantum computing',
  model: 'claude-opus-4-1',
  branchId: branch.id
});

// Compare responses
console.log('GPT-5:', gptResponse.assistantMessage.content);
console.log('Claude:', claudeResponse.assistantMessage.content);
```

---

## Model Parameters

Both models support the same parameters:

### temperature
- **Type:** `number`
- **Range:** `0.0` to `1.0`
- **Default:** `0.7`
- **Description:** Controls randomness (0 = deterministic, 1 = creative)

```typescript
{
  temperature: 0.7  // Balanced creativity
}
```

### maxTokens
- **Type:** `number`
- **Range:** Model-dependent
- **Default:** `2048`
- **Description:** Maximum response length

```typescript
{
  maxTokens: 1000  // Shorter response
}
```

---

## Streaming Support

Both models support real-time streaming:

```typescript
await client.messages.stream(
  conversationId,
  {
    content: 'Write a story',
    model: 'gpt-5'  // or 'claude-opus-4-1'
  },
  (chunk) => {
    if (chunk.choices?.[0]?.delta?.content) {
      process.stdout.write(chunk.choices[0].delta.content);
    }
  }
);
```

---

## Future Models

> **Note:** Additional models may be added in future releases. Check the API `/models` endpoint for the latest available models:

```typescript
// This endpoint will be added in future SDK versions
const models = await client.models.list();
```

---

## Model Pricing

Token usage is tracked automatically. Check your usage:

```typescript
const usage = await client.usage.get();
console.log(usage.models);
// {
//   "gpt-5": { tokens: 10000, calls: 50 },
//   "claude-opus-4-1": { tokens: 5000, calls: 25 }
// }
```

> **Note:** Usage tracking API will be available in SDK v0.2.0

---

## Model Aliases (Future)

In future versions, we may support aliases:
- `latest` → `gpt-5`
- `openai` → `gpt-5`
- `anthropic` → `claude-opus-4-1`

---

## Error Handling

If you use an invalid model:

```typescript
try {
  await client.messages.send(conv.id, {
    content: 'Hello',
    model: 'invalid-model'  // ❌ Not supported
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid model:', error.message);
    // Error: Invalid model. Supported: gpt-5, claude-opus-4-1
  }
}
```

---

## Best Practices

1. **Default Model:** Use `gpt-5` as default for most use cases
2. **A/B Testing:** Use branches to compare model responses
3. **Streaming:** Enable streaming for better UX on long responses
4. **Temperature:** Use lower values (0.3-0.5) for factual content
5. **Max Tokens:** Set reasonable limits to control costs

---

## Questions?

- **Documentation:** [docs.chatroutes.com](https://docs.chatroutes.com)
- **Support:** support@chatroutes.com
- **Models Endpoint:** `GET /api/v1/models` (coming in v0.2.0)

---

**Current Models:** 2 (GPT-5, Claude Opus 4.1)
**More models:** Coming in future releases
