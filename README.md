# ChatRoutes SDK

> 🧩 Build **branching AI conversations** directly into your app.
> Manage conversations, branches, and parallel AI responses via the official [ChatRoutes API](https://api.chatroutes.com).

[![npm version](https://badge.fury.io/js/chatroutes-sdk.svg)](https://www.npmjs.com/package/chatroutes-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/chatroutes/chatroutes-sdk)](https://github.com/chatroutes/chatroutes-sdk/issues)
[![Docs](https://img.shields.io/badge/docs-docs.chatroutes.com-blue)](https://docs.chatroutes.com)
![Status: Beta](https://img.shields.io/badge/status-beta-orange)
![Version 0.1.0](https://img.shields.io/badge/version-0.1.0-blue)

---

**Keywords:** LLM, branching AI, OpenAI, Claude, conversation tree, chat SDK, AI developer tools, research assistant, multi-model AI

🎮 **Try it live:** [ChatRoutes Demo](https://chatroutes.com/demo)

---

## 💡 Why Use ChatRoutes SDK?

Most AI chats are linear. ChatRoutes lets you:
- 🌱 Fork, compare, and merge AI conversation branches.
- 🔁 Run parallel responses across multiple models.
- 🧠 Visualize conversation trees programmatically.
- 🧩 Use the same APIs that power [ChatRoutes.com](https://chatroutes.com).

Perfect for:
- Researchers comparing LLM responses
- Writers exploring narrative branches
- Developers building chat UIs or AI copilots

---

## 🚀 Quick Start

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

console.log(response.assistantMessage.content);
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

console.log(response.userMessage.content);
console.log(response.assistantMessage.content);

// Stream responses (real-time)
await client.messages.stream(
  conversationId,
  { content: 'Write a long article about AI', model: 'gpt-5' },
  (chunk) => {
    if (chunk.choices?.[0]?.delta?.content) {
      process.stdout.write(chunk.choices[0].delta.content);
    }
  },
  (complete) => {
    console.log('\n\nStreaming complete!');
    console.log('Full response:', complete.assistantMessage.content);
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

console.log(tree.metadata);
// { totalNodes: 15, totalBranches: 3, maxDepth: 5 }

console.log(tree.tree); // Recursive structure
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

  console.log('Response:', msg.assistantMessage.content);

  const branch = await client.branches.fork(conv.id, {
    forkPointMessageId: msg.userMessage.id,
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
