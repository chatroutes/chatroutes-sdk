import { ChatRoutesClient } from '@chatroutes/sdk';

const client = new ChatRoutesClient({
  apiKey: process.env.CHATROUTES_API_KEY!
});

async function compareModels() {
  console.log('🔬 Comparing GPT-5 vs Claude Opus 4.1\n');

  const conversation = await client.conversations.create({
    title: 'Model Comparison',
    model: 'gpt-5'
  });

  const testPrompt = 'Explain the concept of recursion in one sentence.';

  console.log('📝 Test Prompt:', testPrompt);
  console.log('\n' + '='.repeat(60) + '\n');

  // Test GPT-5
  console.log('🤖 GPT-5 Response:');
  const gptResponse = await client.messages.send(conversation.id, {
    content: testPrompt,
    model: 'gpt-5',
    temperature: 0.7
  });
  console.log(gptResponse.assistantMessage.content);
  console.log(`📊 Tokens: ${gptResponse.assistantMessage.tokenCount}`);
  console.log(`⏱️  Model: ${gptResponse.assistantMessage.metadata?.model}\n`);

  // Create branch for Claude
  const claudeBranch = await client.branches.fork(conversation.id, {
    forkPointMessageId: gptResponse.userMessage.id,
    title: 'Claude Response',
    contextMode: 'FULL'
  });

  console.log('='.repeat(60) + '\n');

  // Test Claude Opus 4.1
  console.log('🤖 Claude Opus 4.1 Response:');
  const claudeResponse = await client.messages.send(conversation.id, {
    content: testPrompt,
    model: 'claude-opus-4-1',
    temperature: 0.7,
    branchId: claudeBranch.id
  });
  console.log(claudeResponse.assistantMessage.content);
  console.log(`📊 Tokens: ${claudeResponse.assistantMessage.tokenCount}`);
  console.log(`⏱️  Model: ${claudeResponse.assistantMessage.metadata?.model}\n`);

  console.log('='.repeat(60) + '\n');
  console.log('✅ Comparison complete!');

  // Cleanup
  await client.conversations.delete(conversation.id);
}

compareModels().catch(console.error);
