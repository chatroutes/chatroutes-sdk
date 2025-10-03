import { ChatRoutesClient } from '@chatroutes/sdk';

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY!
});

async function basicChat() {
  console.log('🚀 Creating conversation...');

  const conversation = await client.conversations.create({
    title: 'Basic Chat Example',
    model: 'gpt-5'
  });

  console.log(`✅ Created conversation: ${conversation.id}\n`);

  console.log('💬 Sending message...');

  const response = await client.messages.send(conversation.id, {
    content: 'Explain quantum computing in simple terms',
    model: 'gpt-5',
    temperature: 0.7
  });

  console.log('\n📝 User:', response.userMessage.content);
  console.log('\n🤖 Assistant:', response.assistantMessage.content);
  console.log('\n📊 Tokens used:', response.assistantMessage.tokenCount);
}

basicChat().catch(console.error);
