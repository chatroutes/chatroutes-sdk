import { ChatRoutesClient } from '@chatroutes/sdk';

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY!
});

async function branchingExample() {
  console.log('🚀 Creating conversation...');

  const conversation = await client.conversations.create({
    title: 'Branching Example',
    model: 'gpt-5'
  });

  console.log(`✅ Created conversation: ${conversation.id}\n`);

  console.log('💬 Sending initial message...');

  const response = await client.messages.send(conversation.id, {
    content: 'What are the benefits of TypeScript?',
    model: 'gpt-5'
  });

  console.log('✅ Received response\n');

  console.log('🌿 Creating a branch...');

  const branch = await client.branches.fork(conversation.id, {
    forkPointMessageId: response.assistantMessage.id,
    title: 'Alternative Discussion',
    contextMode: 'FULL'
  });

  console.log(`✅ Created branch: ${branch.id}\n`);

  console.log('📋 Listing all branches...');

  const branches = await client.branches.list(conversation.id);

  for (const b of branches) {
    console.log(`  - ${b.title} (${b.isMain ? 'Main' : 'Branch'}) - ${b.messageCount || 0} messages`);
  }

  console.log('\n💬 Sending message to new branch...');

  await client.messages.send(conversation.id, {
    content: 'Now explain the disadvantages of TypeScript',
    model: 'gpt-5',
    branchId: branch.id
  });

  console.log('✅ Message sent to branch\n');

  console.log('🌳 Getting conversation tree...');

  const tree = await client.conversations.getTree(conversation.id);

  console.log(`📊 Tree stats:`);
  console.log(`  - Total nodes: ${tree.metadata.totalNodes}`);
  console.log(`  - Total branches: ${tree.metadata.totalBranches}`);
  console.log(`  - Max depth: ${tree.metadata.maxDepth}`);
}

branchingExample().catch(console.error);
