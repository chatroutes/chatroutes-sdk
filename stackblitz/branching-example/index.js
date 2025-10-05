import { ChatRoutesClient } from 'chatroutes';

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY || 'your-api-key-here'
});

async function branchingExample() {
  console.log('🚀 ChatRoutes SDK - Conversation Branching\n');

  // Create a conversation
  const conversation = await client.conversations.create({
    title: 'Branching Demo',
    model: 'gpt-5'
  });

  console.log(`✅ Created conversation: ${conversation.id}\n`);

  // Send initial message
  console.log('💬 Sending initial message...');
  const response = await client.messages.send(conversation.id, {
    content: 'What are the benefits of TypeScript?',
    model: 'gpt-5'
  });

  console.log('✅ Received response\n');

  // Create a branch to explore an alternative path
  console.log('🌿 Creating a branch for alternative discussion...');
  const branch = await client.branches.fork(conversation.id, {
    forkPointMessageId: response.message.id,
    title: 'Alternative Discussion',
    contextMode: 'FULL'
  });

  console.log(`✅ Created branch: ${branch.id}\n`);

  // List all branches
  console.log('📋 Listing all branches:');
  const branches = await client.branches.list(conversation.id);
  for (const b of branches) {
    console.log(`  - ${b.title} (${b.isMain ? 'Main' : 'Branch'}) - ${b.messageCount || 0} messages`);
  }

  // Send message to the new branch
  console.log('\n💬 Sending message to new branch...');
  await client.messages.send(conversation.id, {
    content: 'Now explain the disadvantages of TypeScript',
    model: 'gpt-5',
    branchId: branch.id
  });

  console.log('✅ Message sent to branch\n');

  // Get conversation tree structure
  console.log('🌳 Getting conversation tree...');
  const tree = await client.conversations.getTree(conversation.id);

  console.log('📊 Tree structure:');
  console.log(`  - Conversation: ${tree.conversation.title}`);
  console.log(`  - Total branches: ${tree.branches.length}`);
  console.log(`  - Main branch: ${tree.mainBranch.title}`);
}

branchingExample().catch(console.error);
