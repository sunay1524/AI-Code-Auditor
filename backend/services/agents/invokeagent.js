require("dotenv").config();

const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const {
    SystemMessage,
    HumanMessage
} = require("@langchain/core/messages");

const { formatRepositoryForLLM } = require("../formatter");

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.2
});

async function invokeAgent(repo, systemPrompt, schema) {

    const formattedRepository = formatRepositoryForLLM(repo);

    const humanPrompt = new HumanMessage(`
Analyze the following GitHub repository.

Repository:

${formattedRepository}
`);

    const messages = [
        new SystemMessage(systemPrompt),
        humanPrompt
    ];

    const structuredLLM = llm.withStructuredOutput(schema);

    const output = await structuredLLM.invoke(messages);

    return output;
}

module.exports = { invokeAgent };