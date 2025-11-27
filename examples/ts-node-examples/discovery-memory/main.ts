/**
 * Discovery + vector memory example.
 *
 * Run with a control plane at AGENTFIELD_URL (defaults to http://localhost:8080):
 *   AGENT_ID=ts-discovery-demo npm run dev:discovery
 * or with ts-node directly:
 *   AGENT_ID=ts-discovery-demo node --loader ts-node/esm discovery-memory/main.ts
 *
 * The reasoner demonstrates:
 * - Workflow progress updates via ctx.workflow.progress()
 * - Storing/searching vectors with ctx.memory.setVector/searchVector()
 * - Discovering other agents via ctx.discover()
 */
import { Agent, AgentRouter } from '@agentfield/sdk';

type DemoInput = {
  text: string;
  embedding: number[];
  queryEmbedding: number[];
  filters?: Record<string, any>;
  discoveryTags?: string[];
  extraChunks?: Array<{ key: string; embedding: number[]; metadata?: Record<string, any> }>;
};

const router = new AgentRouter({ prefix: 'demo' });

router.reasoner<DemoInput, any>('discover-and-vector', async (ctx) => {
  await ctx.workflow.progress(5, { result: { stage: 'starting' } });

  const storedKeys: string[] = [];

  // Store the input embedding in workflow-scoped memory
  const primaryKey = `demo:${ctx.executionId}:chunk`;
  await ctx.memory.setVector(primaryKey, ctx.input.embedding, { text: ctx.input.text }, 'workflow');
  storedKeys.push(primaryKey);

  // Optionally store extra chunks provided by the caller
  if (Array.isArray(ctx.input.extraChunks)) {
    for (const chunk of ctx.input.extraChunks) {
      const key = chunk.key || `chunk:${storedKeys.length}`;
      await ctx.memory.setVector(key, chunk.embedding, chunk.metadata, 'workflow');
      storedKeys.push(key);
    }
  }
  await ctx.workflow.progress(25, { result: { stage: 'vector-stored' } });

  // Run a similarity search against the workflow scope
  const matches = await ctx.memory.searchVector(ctx.input.queryEmbedding, {
    topK: 5,
    filters: ctx.input.filters,
    scope: 'workflow'
  });
  await ctx.workflow.progress(60, { result: { stage: 'vector-searched', matchCount: matches.length } });

  // Discover other agents/reasoners by tag
  const discovery = await ctx.discover({
    tags: ctx.input.discoveryTags,
    includeInputSchema: true,
    includeOutputSchema: true
  });
  await ctx.workflow.progress(100, {
    status: 'succeeded',
    result: { stage: 'complete', discoveredAgents: discovery.json?.totalAgents ?? 0 }
  });

  return {
    matches,
    storedKeys,
    discovery: discovery.json ?? discovery.compact ?? discovery.xml,
    discoverySummary: discovery.json
      ? {
          totalAgents: discovery.json.totalAgents,
          totalReasoners: discovery.json.totalReasoners,
          totalSkills: discovery.json.totalSkills
        }
      : undefined,
    workflow: {
      executionId: ctx.executionId,
      runId: ctx.runId,
      workflowId: ctx.workflowId
    }
  };
});

async function main() {
  const agent = new Agent({
    nodeId: process.env.AGENT_ID ?? 'ts-discovery-demo',
    port: Number(process.env.PORT ?? 8004),
    agentFieldUrl: process.env.AGENTFIELD_URL ?? 'http://localhost:8080',
    aiConfig: {
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: process.env.OPENAI_API_KEY
    },
    devMode: true
  });

  agent.includeRouter(router);

  await agent.serve();
  // eslint-disable-next-line no-console
  console.log(`Discovery/memory demo agent listening on ${agent.config.port}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
}
