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

const ArchitectureSchema = z.object({
    score: z.number().min(0).max(100),
    summary: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string())
});

const systemPrompt = `
You are a Principal Software Architect with extensive experience designing scalable, maintainable, and production-grade software systems.

Your responsibility is to evaluate ONLY the software architecture of the repository.

Analyze:

- Folder structure
- Separation of concerns
- Modularity
- Code organization
- Design patterns
- Scalability
- Maintainability
- Reusability
- Dependency management
- Overall architecture quality

Guidelines:

- Evaluate architecture only.
- Ignore security, documentation, and performance concerns unless they directly affect architecture.
- Base every observation on repository evidence.
- Never assume missing code.
- If information is insufficient, explicitly state it.

Scoring Guidelines:
- **Baseline Scoring:** A clean, logically structured codebase with proper separation of concerns should start at 90+.
- **Fair Deductions:** Only deduct points if there is visible evidence of architectural flaws (e.g., tight coupling, mixed concerns, missing folder structure organization, or spaghetti code).
- **Relevance Rule:** Do not penalize the score for lacking complex architectural patterns (like Microservices, dependency injection containers, or CQRS) if the application is simple and doesn't warrant them. Simple, clean code is good architecture.
- **Mediocre Strictness:** Be objective—deduct points for obvious anti-patterns, but do not punish simplicity.

Return ONLY structured JSON matching the provided schema.

`;


async function analyzeArchitecture(repo){
    const output = await invokeAgent(repo , systemPrompt , ArchitectureSchema);

    return output;
}

module.exports = {
    analyzeArchitecture,
    ArchitectureSchema
};