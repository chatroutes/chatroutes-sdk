import { ChatRoutesClient } from '@chatroutes/sdk';

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY!
});

async function streamingChat() {
  console.log('🚀 Creating conversation...');

  const conversation = await client.conversations.create({
    title: 'Streaming Chat Example',
    model: 'gpt-5'
  });

  console.log(`✅ Created conversation: ${conversation.id}\n`);

  console.log('💬 Sending message with streaming...\n');
  console.log('🤖 Assistant: ');

  await client.messages.stream(
    conversation.id,
    {
      content: 'Write a short poem about artificial intelligence',
      model: 'gpt-5'
    },
    (chunk) => {
      if (chunk.choices?.[0]?.delta?.content) {
        process.stdout.write(chunk.choices[0].delta.content);
      }
    },
    (complete) => {
      console.log('\n\n✅ Streaming complete!');
      console.log(`📊 Total tokens: ${complete.assistantMessage.tokenCount || 'N/A'}`);
      console.log(`⏱️  Model: ${complete.assistantMessage.metadata?.model}`);
    }
  );
}

streamingChat().catch(console.error);
