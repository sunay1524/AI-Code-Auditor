const {z} = require("zod");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const {
    SystemMessage,
    HumanMessage
} = require("@langchain/core/messages");

const CoordinatorSchema = z.object({
    summary: z.string(),
    overallScore: z.number().min(0).max(100),
    strongestAspects: z.array(z.string()),
    criticalWeaknesses: z.array(z.string()),
    recommendations: z.array(z.string()),
    security: z.any(),
    architecture: z.any(),
    performance: z.any(),
    documentation: z.any()
});
const systemPrompt = `
You are a Principal Software Engineering Manager responsible for conducting final technical reviews.

You will receive the reports produced by four specialist reviewers:

- Security Engineer
- Software Architect
- Performance Engineer
- Documentation Engineer

Your responsibility is NOT to review the repository again.

Instead:

- Combine the findings from all reviewers.
- Resolve duplicate observations.
- Produce an executive summary.
- Calculate an overall repository score between 0 and 100.
- Produce prioritized recommendations.
- Highlight the repository's strongest aspects.
- Highlight the repository's most critical weaknesses.

Base your conclusions ONLY on the specialist reports.

Do not invent new issues.

Return ONLY structured JSON matching the provided schema.
`;

async function generateFinalReport(
    securityReport,
    architectureReport,
    performanceReport,
    documentationReport
) {


const humanPrompt = new HumanMessage(`
You have received the outputs from four specialist software engineering reviewers.

Your task is to combine these reports into a single executive audit report.

Do NOT perform another repository analysis.
Do NOT invent new findings.
Base your conclusions ONLY on the reports below.

----------------------------
Security Review
----------------------------

${JSON.stringify(securityReport, null, 2)}

----------------------------
Architecture Review
----------------------------

${JSON.stringify(architectureReport, null, 2)}

----------------------------
Performance Review
----------------------------

${JSON.stringify(performanceReport, null, 2)}

----------------------------
Documentation Review
----------------------------

${JSON.stringify(documentationReport, null, 2)}

Using these reports:

- Write a concise executive summary.
- Determine an overall repository score between 0 and 100.
- Preserve each specialist report in the final output.
- Merge duplicate recommendations into a single prioritized recommendation list.
- Return ONLY structured JSON matching the provided schema.
`);

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.2
});

 const messages = [
        new SystemMessage(systemPrompt),
        humanPrompt
    ];

    const structuredLLM =
        llm.withStructuredOutput(CoordinatorSchema);

    const output =
        await structuredLLM.invoke(messages);


    return output;

}
    module.exports = {
    generateFinalReport
};