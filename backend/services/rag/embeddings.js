const { ChromaClient } = require("chromadb");
const {
    GoogleGenerativeAIEmbeddings
} = require("@langchain/google-genai");
const { MemoryVectorStore } = require("@langchain/classic/vectorstores/memory");
const { TaskType } = require("@google/generative-ai");

const embeddingModel = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT
});

async function embedRepo(documents) {


    const vectorStore = new MemoryVectorStore(embeddingModel);

    await vectorStore.addDocuments(documents);

    return vectorStore;
}


module.exports = { embedRepo };