# ChatRoutes SDK

> 🧩 **Build branching, forkable AI conversations directly into your app** — using the same APIs that power [chatroutes.com](https://chatroutes.com).

[![npm version](https://badge.fury.io/js/chatroutes-sdk.svg)](https://www.npmjs.com/package/chatroutes-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/chatroutes/chatroutes-sdk)](https://github.com/chatroutes/chatroutes-sdk/issues)
[![Docs](https://img.shields.io/badge/docs-docs.chatroutes.com-blue)](https://docs.chatroutes.com)
![Status: Beta](https://img.shields.io/badge/status-beta-orange)
![Version 0.1.0](https://img.shields.io/badge/version-0.1.0-blue)

---

**ChatRoutes SDK** is a developer-first gateway to the ChatRoutes ecosystem, giving you infrastructure access to:

✅ **Authentication** via API keys (from user dashboard)
✅ **Conversation management** (create, list, delete)
✅ **Branching / forking / merging** conversation paths
✅ **Parallel responses** across multiple AI models
✅ **Streaming responses** (real-time SSE)
✅ **Conversation trees** (visualize and navigate branches)

Perfect for:
- 🔬 Researchers comparing LLM responses
- ✍️ Writers exploring narrative branches
- 💻 Developers building chat UIs or AI copilots

**Keywords:** LLM, branching AI, OpenAI, Claude, conversation tree, chat SDK, AI developer tools, research assistant, multi-model AI

---

## 🔑 Get an API Key

To use ChatRoutes SDK, sign up at [chatroutes.com](https://chatroutes.com) and obtain your API key from the **Dashboard → API Keys** section.

```typescript
const client = new ChatRoutesClient({ apiKey: 'cr_prod_sk_xxx' });
```

> 🎮 **Try it live:** [ChatRoutes Demo](https://chatroutes.com/demo)

---

## 🚀 Quick Start

### ⚡ Try It Now on StackBlitz

Get started instantly with our ready-to-run examples:

| Example | Description | Link |
|---------|-------------|------|
| **Basic Chat** | Simple conversation creation and messaging | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/chatroutes/chatroutes-sdk/tree/main/stackblitz/basic-example) |
| **Streaming** | Real-time SSE streaming responses | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/chatroutes/chatroutes-sdk/tree/main/stackblitz/streaming-example) |
| **Branching** | Fork conversations and explore alternatives | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/chatroutes/chatroutes-sdk/tree/main/stackblitz/branching-example) |
| **Model Comparison** | Compare GPT-5 vs Claude side-by-side | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/chatroutes/chatroutes-sdk/tree/main/stackblitz/model-comparison) |

> **Note:** You'll need a ChatRoutes API key to run the examples. Get one free at [chatroutes.com](https://chatroutes.com).

### Installation

```bash
npm install chatroutes-sdk
```

### Basic Usage

```typescript
import { ChatRoutesClient } from 'chatroutes-sdk';

const client = new ChatRoutesClient({
  apiKey: 'your-api-key'
});

// Create a conversation
const conversation = await client.conversations.create({
  title: 'My AI Chat',
  model: 'gpt-5'
});

// Send a message
const response = await client.messages.send(conversation.id, {
  content: 'Hello! Explain quantum computing.',
  model: 'gpt-5'
});

console.log(response.message.content);
console.log('Model:', response.model);
console.log('Usage:', response.usage);
```

## 📋 Prerequisites

**You must have a ChatRoutes account to use this SDK:**

1. Register for free at [chatroutes.com](https://chatroutes.com)
2. Generate an API key from your dashboard
3. Use the API key to initialize the SDK

> ⚠️ **API key required** - No guest mode available. All users must register for a free account to obtain an API key.

## 🎯 Features

✅ Full TypeScript Support (types included)
✅ Streaming Responses (SSE)
✅ Conversation Branching (create and manage branches)
✅ Parallel Responses (multi-model testing)
✅ Auto Retry + Backoff
✅ Modern ESM/CJS builds
✅ Node.js + Browser Support

## 📚 Core Concepts

### 🔐 Authentication

```typescript
const client = new ChatRoutesClient({
  apiKey: 'cr_prod_sk_your_key_here'
});
```

### 💬 Conversations

```typescript
// Create a conversation
const conv = await client.conversations.create({
  title: 'Project Planning',
  model: 'gpt-5'
});

// List conversations
const { data: conversations } = await client.conversations.list({
  page: 1,
  limit: 10
});

// Get a conversation
const conversation = await client.conversations.get(conv.id);

// Update
await client.conversations.update(conv.id, {
  title: 'Updated Title'
});

// Delete
await client.conversations.delete(conv.id);
```

### 🧠 Messages

```typescript
// Send a message (blocking)
const response = await client.messages.send(conversationId, {
  content: 'Explain machine learning',
  model: 'gpt-5',
  temperature: 0.7,
  maxTokens: 1000
});

console.log(response.message.content);
console.log('Usage:', response.usage);

// Stream responses (real-time)
await client.messages.stream(
  conversationId,
  { content: 'Write a long article about AI', model: 'gpt-5' },
  (chunk) => {
    if (chunk.type === 'content' && chunk.content) {
      process.stdout.write(chunk.content);
    }
  },
  (complete) => {
    console.log('\n\nStreaming complete!');
    console.log('Full response:', complete.message.content);
    console.log('Tokens:', complete.usage.totalTokens);
  }
);
```

### 🌿 Branches

```typescript
// List all branches in a conversation
const branches = await client.branches.list(conversationId);

// Fork a conversation from a specific message
const newBranch = await client.branches.fork(conversationId, {
  forkPointMessageId: messageId,
  title: 'Alternative Approach',
  contextMode: 'FULL' // FULL, PARTIAL, MINIMAL
});

// Create a new branch manually
const branch = await client.branches.create(conversationId, {
  title: 'Technical Deep Dive',
  baseNodeId: messageId,
  contextMode: 'FULL'
});

// Get branch messages
const messages = await client.branches.getMessages(conversationId, branch.id);
```

### 🌳 Conversation Tree

```typescript
const tree = await client.conversations.getTree(conversationId);

console.log('Conversation:', tree.conversation.title);
console.log('Total branches:', tree.branches.length);
console.log('Main branch:', tree.mainBranch.title);
```

## 🔧 Configuration

```typescript
const client = new ChatRoutesClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.chatroutes.com',  // optional
  timeout: 30000,                         // default 30s
  retryAttempts: 3,                       // default 3
  retryDelay: 1000                        // ms between retries
});
```

## ❌ Error Handling

```typescript
import {
  ChatRoutesError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError
} from 'chatroutes-sdk';

try {
  const conv = await client.conversations.get('invalid-id');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof ValidationError) {
    console.error('Invalid request:', error.details);
  } else if (error instanceof NotFoundError) {
    console.error('Conversation not found');
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded, retry after:', error.retryAfter);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## 🧩 Example — Complete Chat Demo

```typescript
import { ChatRoutesClient } from 'chatroutes-sdk';

async function main() {
  const client = new ChatRoutesClient({
    apiKey: process.env.CHATROUTES_API_KEY
  });

  const conv = await client.conversations.create({
    title: 'Demo',
    model: 'gpt-5'
  });

  const msg = await client.messages.send(conv.id, {
    content: 'Explain branching AI'
  });

  console.log('Response:', msg.message.content);

  const branch = await client.branches.fork(conv.id, {
    forkPointMessageId: msg.message.id,
    title: 'Alternative version'
  });

  console.log('Created branch:', branch.title);
}

main().catch(console.error);
```

## 🌐 Environment Support

- **Node.js** ≥ 18.x
- **Modern browsers** with Fetch API
- **TypeScript** ≥ 5.x

## 🔐 Security & Terms

- Use of this SDK requires adherence to [ChatRoutes Terms of Service](https://chatroutes.com/terms).
- ChatRoutes and its parent company **Mednosis LLC** reserve the right to revoke API access for misuse or abuse.

## 🤝 Contributing

- See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.
- Report bugs → [GitHub Issues](https://github.com/chatroutes/chatroutes-sdk/issues)
- Discuss ideas → [Discussions](https://github.com/chatroutes/chatroutes-sdk/discussions)
- Community → [r/ChatRoutes](https://reddit.com/r/ChatRoutes)

## 🔗 Links

- 🌐 [Website](https://chatroutes.com)
- 🧰 [API Documentation](https://docs.chatroutes.com)
- 💻 [GitHub](https://github.com/chatroutes/chatroutes-sdk)
- 🐛 [Issues](https://github.com/chatroutes/chatroutes-sdk/issues)
- ✉️ [Support](mailto:support@chatroutes.com)

## 📊 Status

| Property | Value |
|----------|-------|
| **Version** | 0.1.0 (Beta) |
| **Status** | Early Access |
| **License** | MIT |
| **Maintainer** | Afzal Farooqui |
| **Organization** | ChatRoutes |

---

**© 2025 Mednosis LLC. All rights reserved.**
