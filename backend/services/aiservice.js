const { analyzeSecurity } = require("./agents/SecurityAgent");
const { analyzeArchitecture } = require("./agents/ArchitectureAgent");
const { analyzePerformance } = require("./agents/PerformanceAgent");
const { analyzeDocumentation } = require("./agents/DocumentationAgent");

const { generateFinalReport } = require("./agents/CoordinatorAgent");

const { chunkRepo } = require("./rag/chunkRepositories");
const { embedRepo } = require("./rag/embeddings");
const { retrieveRelevantChunks } = require("./rag/retriever");

const {
    SECURITY_QUERY,
    ARCHITECTURE_QUERY,
    PERFORMANCE_QUERY,
    DOCUMENTATION_QUERY,
    SECURITY_K,
    ARCHITECTURE_K,
    PERFORMANCE_K,
    DOCUMENTATION_K
} = require("./rag/retrievelQueries");

async function generateAuditReport(repo) {

    // Step 1 - Chunk the repository
    const documents = await chunkRepo(repo);

    // Step 2 - Create the vector store
    const vectorStore = await embedRepo(documents);

    // Step 3 - Retrieve relevant documents for each agent
const [
    securityDocs,
    architectureDocs,
    performanceDocs,
    documentationDocs
] = await Promise.all([
    retrieveRelevantChunks(vectorStore, SECURITY_QUERY, SECURITY_K),
    retrieveRelevantChunks(vectorStore, ARCHITECTURE_QUERY, ARCHITECTURE_K),
    retrieveRelevantChunks(vectorStore, PERFORMANCE_QUERY, PERFORMANCE_K),
    retrieveRelevantChunks(vectorStore, DOCUMENTATION_QUERY, DOCUMENTATION_K)
]);

    // Step 4 - Run the specialist agents
    const [
        securityReport,
        architectureReport,
        performanceReport,
        documentationReport
    ] = await Promise.all([
        analyzeSecurity(securityDocs),
        analyzeArchitecture(architectureDocs),
        analyzePerformance(performanceDocs),
        analyzeDocumentation(documentationDocs)
    ]);

    // Step 5 - Generate the final report
    const finalReport = await generateFinalReport(
        securityReport,
        architectureReport,
        performanceReport,
        documentationReport
    );

    return finalReport;
}

module.exports = {
    generateAuditReport
};