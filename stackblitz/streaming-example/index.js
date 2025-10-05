import { ChatRoutesClient } from 'chatroutes-sdk';

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY || 'your-api-key-here'
});

async function streamingExample() {
  console.log('🚀 ChatRoutes SDK - Streaming Example\n');

  // Create a conversation
  const conversation = await client.conversations.create({
    title: 'Streaming Demo',
    model: 'gpt-5'
  });

  console.log(`✅ Created: ${conversation.id}\n`);
  console.log('💬 Sending message with real-time streaming...\n');
  console.log('🤖 Assistant: ');

  // Stream the response in real-time
  await client.messages.stream(
    conversation.id,
    {
      content: 'Write a short poem about artificial intelligence',
      model: 'gpt-5'
    },
    // onChunk - called for each chunk of text
    (chunk) => {
      if (chunk.type === 'content' && chunk.content) {
        process.stdout.write(chunk.content);
      }
    },
    // onComplete - called when streaming finishes
    (complete) => {
      console.log('\n\n✅ Streaming complete!');
      console.log(`📊 Total tokens: ${complete.usage.totalTokens}`);
      console.log(`⏱️  Model: ${complete.model}`);
    }
  );
}

streamingExample().catch(console.error);
