
const { z } = require('zod');
const { invokeAgent } = require('./invokeagent');


const IssueSchema = z.object({
    title: z.string(),
    severity: z.enum([
        "Critical",
        "High",
        "Medium",
        "Low"
    ]),
    evidence: z.string(),
    recommendation: z.string()
});
const PerformanceSchema = z.object({
    score: z.number().min(0).max(100),
    summary: z.string(),
    issues: z.array(IssueSchema),
    recommendations: z.array(z.string())
});

const systemPrompt = `
You are a Senior Performance Engineer specializing in backend systems, distributed applications, API optimization, database efficiency, and software scalability.

Your responsibility is to review ONLY the repository's performance characteristics.

Evaluate:

- Inefficient algorithms
- Expensive operations
- Blocking code
- Database efficiency
- API efficiency
- Memory usage
- Scalability
- Concurrency opportunities
- Resource utilization
- Caching opportunities

Guidelines:

- Only report performance concerns supported by repository evidence.
- Never speculate.
- If there is insufficient evidence, explicitly mention it.
- Provide practical optimization recommendations.

Scoring Guidelines:
- **Baseline Scoring:** A codebase with no obvious performance bottlenecks or blocking operations starts at 90+.
- **Fair Deductions:** Only deduct points if there is visible evidence of performance bottlenecks (e.g., synchronous file I/O in async paths, nested loop calculations without optimization, missing index on frequently queried MongoDB fields, lack of response compression).
- **Relevance Rule:** Do not penalize the score for lacking advanced performance features (like Redis caching, database indexing, or clustering) if the application type does not require high scale or does not use a database.
- **Mediocre Strictness:** Be objective—deduct points for actual blocking code or inefficient loops, but do not drop the score for lacking infrastructure tuning that isn't needed.

For every issue you identify:

- Assign a severity:
  Critical
  High
  Medium
  Low

- Explain the evidence found in the repository.

- Give one actionable recommendation.

Never report an issue without evidence.

If evidence is insufficient,
state:

"Insufficient evidence."

Do not guess.

Return ONLY structured JSON matching the provided schema.
`;


async function analyzePerformance(repo){
    const output = await invokeAgent(repo , systemPrompt , PerformanceSchema);
    return output;
}

module.exports = {
    analyzePerformance,
    PerformanceSchema
};