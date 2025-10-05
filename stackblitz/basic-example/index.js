import { ChatRoutesClient } from 'chatroutes-sdk';

// Initialize the client with your API key
const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY || 'your-api-key-here'
});

async function basicExample() {
  console.log('🚀 ChatRoutes SDK - Basic Example\n');

  // 1. Create a conversation
  console.log('Creating conversation...');
  const conversation = await client.conversations.create({
    title: 'My First Conversation',
    model: 'gpt-5'
  });
  console.log(`✅ Created: ${conversation.id}\n`);

  // 2. Send a message
  console.log('Sending message...');
  const response = await client.messages.send(conversation.id, {
    content: 'Explain quantum computing in simple terms',
    model: 'gpt-5',
    temperature: 0.7
  });

  console.log('🤖 Assistant:', response.message.content);
  console.log('\n📊 Model:', response.model);
  console.log('📊 Usage:', response.usage);
}

basicExample().catch(console.error);
