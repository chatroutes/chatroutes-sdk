# ChatRoutes SDK Examples

This directory contains example code demonstrating how to use the ChatRoutes SDK.

## Prerequisites

1. **Install the SDK**
   ```bash
   npm install chatroutes
   ```

2. **Get an API Key**
   - Register at [chatroutes.com](https://chatroutes.com)
   - Generate an API key from your dashboard

3. **Set Environment Variable**
   ```bash
   # On Unix/macOS
   export CHATROUTES_API_KEY="your_api_key_here"

   # On Windows (PowerShell)
   $env:CHATROUTES_API_KEY="your_api_key_here"

   # Or create a .env file
   echo "CHATROUTES_API_KEY=your_api_key_here" > .env
   ```

## Running Examples

### Basic Chat

Simple example of creating a conversation and sending a message.

```bash
npx tsx examples/basic-chat.ts
```

**What it does:**
- Creates a new conversation
- Sends a message asking about quantum computing
- Displays the AI response

### Streaming Chat

Example of real-time streaming responses.

```bash
npx tsx examples/streaming-chat.ts
```

**What it does:**
- Creates a conversation
- Streams an AI response in real-time
- Shows tokens as they arrive

### Branching

Example of conversation branching and forking.

```bash
npx tsx examples/branching.ts
```

**What it does:**
- Creates a conversation
- Sends initial messages
- Creates a branch (fork) from a message
- Sends messages to the new branch
- Shows conversation tree structure

## Example Code Snippets

### Authentication

```typescript
import { ChatRoutesClient } from 'chatroutes';

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY!
});

// Register new user
const { user, tokens } = await client.auth.register({
  email: 'user@example.com',
  password: 'secure_password'
});

// Login
const { user, tokens } = await client.auth.login({
  email: 'user@example.com',
  password: 'secure_password'
});

// Get current user
const user = await client.auth.me();
```

### Conversations

```typescript
// Create
const conv = await client.conversations.create({
  title: 'My Conversation',
  model: 'gpt-5'
});

// List with pagination
const { data, total, page } = await client.conversations.list({
  page: 1,
  limit: 10
});

// Get specific conversation
const conversation = await client.conversations.get(conv.id);

// Update
await client.conversations.update(conv.id, {
  title: 'Updated Title'
});

// Delete
await client.conversations.delete(conv.id);
```

### Messages

```typescript
// Send message (blocking)
const response = await client.messages.send(conversationId, {
  content: 'Hello, AI!',
  model: 'gpt-5', // or 'claude-opus-4-1'
  temperature: 0.7,
  maxTokens: 1000
});

// Stream message (real-time)
await client.messages.stream(
  conversationId,
  { content: 'Write a story' },
  (chunk) => {
    // Handle each chunk
    if (chunk.choices?.[0]?.delta?.content) {
      process.stdout.write(chunk.choices[0].delta.content);
    }
  },
  (complete) => {
    // Handle completion
    console.log('Done!');
  }
);

// List messages
const messages = await client.messages.list(conversationId);

// Update message
await client.messages.update(messageId, 'Updated content');

// Delete message
await client.messages.delete(messageId);
```

### Branches

```typescript
// List branches
const branches = await client.branches.list(conversationId);

// Fork conversation
const branch = await client.branches.fork(conversationId, {
  forkPointMessageId: messageId,
  title: 'Alternative Path',
  contextMode: 'FULL'
});

// Create branch manually
const newBranch = await client.branches.create(conversationId, {
  title: 'New Branch',
  baseNodeId: messageId
});

// Get branch messages
const messages = await client.branches.getMessages(
  conversationId,
  branchId
);

// Update branch
await client.branches.update(conversationId, branchId, {
  title: 'Updated Branch Name'
});

// Delete branch
await client.branches.delete(conversationId, branchId);
```

### Error Handling

```typescript
import {
  AuthenticationError,
  ValidationError,
  NotFoundError,
  RateLimitError,
  NetworkError
} from 'chatroutes';

try {
  const conv = await client.conversations.get('invalid-id');
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Auth failed:', error.message);
  } else if (error instanceof ValidationError) {
    console.error('Validation error:', error.details);
  } else if (error instanceof NotFoundError) {
    console.error('Not found:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limited, retry after:', error.retryAfter);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Available Models

ChatRoutes currently supports:
- **`gpt-5`** - OpenAI GPT-5 (Latest model)
- **`claude-opus-4-1`** - Anthropic Claude Opus 4.1

### Model Comparison

Run the model comparison example:
```bash
npx tsx examples/model-comparison.ts
```

This will show responses from both models side-by-side.

## Tips

- Always use environment variables for API keys
- Never commit API keys to version control
- Handle errors appropriately in production code
- Use streaming for long responses
- Implement retry logic for network failures
- Check rate limits and implement backoff
- Choose the right model for your use case (GPT-5 vs Claude)

## More Examples

For more examples, check:
- [GitHub Repository](https://github.com/chatroutes/chatroutes-sdk)
- [Documentation](https://docs.chatroutes.com)
- [API Reference](https://docs.chatroutes.com/api)

## Support

- **Issues**: https://github.com/chatroutes/chatroutes-sdk/issues
- **Email**: support@chatroutes.com
- **Website**: https://chatroutes.com
