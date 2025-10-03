# ChatRoutes SDK

[![npm version](https://badge.fury.io/js/%40chatroutes%2Fsdk.svg)](https://www.npmjs.com/package/@chatroutes/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official TypeScript/JavaScript SDK for [ChatRoutes](https://chatroutes.com) - AI Conversation Branching Platform

## 🚀 Quick Start

### Installation

```bash
npm install @chatroutes/sdk
```

### Basic Usage

```typescript
import { ChatRoutesClient } from '@chatroutes/sdk';

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

> **Note:** ChatRoutes.com and its parent company Mednosis LLC reserve the right to block and delete any API key and access to any user at their discretion.

## 🎯 Features

- ✅ **Full TypeScript Support** - Complete type definitions
- ✅ **Streaming Responses** - Real-time SSE streaming
- ✅ **Conversation Branching** - Create and manage conversation branches
- ✅ **Error Handling** - Comprehensive error types with retry logic
- ✅ **Auto Retry** - Configurable retry attempts with exponential backoff
- ✅ **Modern ESM/CJS** - Works in Node.js and browsers

## 📚 Core Concepts

### Authentication

All API requests require an API key. Get yours at [chatroutes.com](https://chatroutes.com).

```typescript
const client = new ChatRoutesClient({
  apiKey: 'cr_prod_sk_your_key_here'
});
```

### Conversations

Conversations are the main container for your AI interactions.

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

// Get a specific conversation
const conversation = await client.conversations.get(conv.id);

// Update conversation
await client.conversations.update(conv.id, {
  title: 'Updated Title'
});

// Delete conversation
await client.conversations.delete(conv.id);
```

### Messages

Send messages and get AI responses.

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

// Streaming responses (real-time)
await client.messages.stream(
  conversationId,
  {
    content: 'Write a long article about AI',
    model: 'gpt-5'
  },
  (chunk) => {
    // Called for each chunk
    if (chunk.choices?.[0]?.delta?.content) {
      process.stdout.write(chunk.choices[0].delta.content);
    }
  },
  (complete) => {
    // Called when streaming completes
    console.log('\n\nStreaming complete!');
    console.log('Full response:', complete.assistantMessage.content);
  }
);
```

### Branches

Create alternative conversation paths (branching).

```typescript
// List all branches in a conversation
const branches = await client.branches.list(conversationId);

// Fork a conversation from a specific message
const newBranch = await client.branches.fork(conversationId, {
  forkPointMessageId: messageId,
  title: 'Alternative Approach',
  contextMode: 'FULL' // FULL, PARTIAL, or MINIMAL
});

// Create a new branch manually
const branch = await client.branches.create(conversationId, {
  title: 'Technical Deep Dive',
  baseNodeId: messageId,
  contextMode: 'FULL'
});

// Get messages for a specific branch
const messages = await client.branches.getMessages(conversationId, branchId);

// Update branch metadata
await client.branches.update(conversationId, branchId, {
  title: 'Updated Branch Name'
});

// Delete a branch (cannot delete main branch)
await client.branches.delete(conversationId, branchId);
```

### Conversation Tree

Get the full tree structure of a conversation:

```typescript
const tree = await client.conversations.getTree(conversationId);

console.log(tree.metadata);
// {
//   totalNodes: 15,
//   totalBranches: 3,
//   maxDepth: 5
// }

console.log(tree.tree); // Recursive tree structure
```

## 🔧 Configuration

```typescript
const client = new ChatRoutesClient({
  apiKey: 'your-api-key',

  // Optional: Custom base URL (default: https://api.chatroutes.com)
  baseUrl: 'https://api.chatroutes.com',

  // Optional: Request timeout in milliseconds (default: 30000)
  timeout: 30000,

  // Optional: Number of retry attempts (default: 3)
  retryAttempts: 3,

  // Optional: Initial retry delay in milliseconds (default: 1000)
  retryDelay: 1000
});
```

## ❌ Error Handling

The SDK provides specific error types for different scenarios:

```typescript
import {
  ChatRoutesError,
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError
} from '@chatroutes/sdk';

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
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## 🎨 Examples

### Simple Chat Bot

```typescript
import { ChatRoutesClient } from '@chatroutes/sdk';

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY!
});

async function chat(userInput: string) {
  // Create or reuse conversation
  const conv = await client.conversations.create({
    title: 'Chat Session',
    model: 'gpt-5'
  });

  // Send message with streaming
  await client.messages.stream(
    conv.id,
    { content: userInput },
    (chunk) => {
      if (chunk.choices?.[0]?.delta?.content) {
        process.stdout.write(chunk.choices[0].delta.content);
      }
    }
  );

  console.log('\n');
}

chat('Tell me a joke');
```

### Branch Exploration

```typescript
async function exploreBranches(conversationId: string) {
  // Get all branches
  const branches = await client.branches.list(conversationId);

  console.log(`Found ${branches.length} branches:`);

  for (const branch of branches) {
    console.log(`\n📌 ${branch.title} (${branch.isMain ? 'Main' : 'Branch'})`);
    console.log(`   Messages: ${branch.messageCount || 0}`);

    // Get messages for this branch
    const messages = await client.branches.getMessages(conversationId, branch.id);

    for (const msg of messages) {
      console.log(`   ${msg.role}: ${msg.content.substring(0, 50)}...`);
    }
  }
}
```

### Error Recovery with Retry

```typescript
async function robustRequest<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (error instanceof RateLimitError) {
        // Wait based on retry-after header
        await new Promise(r => setTimeout(r, error.retryAfter! * 1000));
        continue;
      }

      if (error instanceof NetworkError && i < maxRetries - 1) {
        // Exponential backoff
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }

      throw error;
    }
  }

  throw lastError!;
}

// Usage
const conv = await robustRequest(() =>
  client.conversations.create({ title: 'Test' })
);
```

## 🌐 Environment Support

- **Node.js**: 18.x or higher
- **Browsers**: Modern browsers with fetch API support
- **TypeScript**: 5.x (types included)

## 📖 API Reference

For complete API documentation, visit [docs.chatroutes.com](https://docs.chatroutes.com)

### Available Models

- `gpt-5` - OpenAI GPT-5 (Latest)
- `claude-opus-4-1` - Anthropic Claude Opus 4.1

> **Note:** ChatRoutes currently supports 2 production models. See [MODELS.md](./MODELS.md) for detailed comparison and usage guide.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🔗 Links

- **Website**: [chatroutes.com](https://chatroutes.com)
- **API Documentation**: [docs.chatroutes.com](https://docs.chatroutes.com)
- **GitHub**: [github.com/chatroutes/chatroutes-sdk](https://github.com/chatroutes/chatroutes-sdk)
- **Issues**: [Report bugs](https://github.com/chatroutes/chatroutes-sdk/issues)
- **Support**: support@chatroutes.com

## 📊 Status

**Version**: 0.1.0 (Beta)
**Status**: Early Access - API may change before 1.0.0

This SDK is in beta. The API is stable but may change before the 1.0.0 release. Please report any issues on GitHub.

---

**© 2025 Mednosis LLC. All rights reserved.**
