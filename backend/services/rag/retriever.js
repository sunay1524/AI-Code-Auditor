

async function retrieveRelevantChunks(vectorStore, query , k=5) {

    const retriever = vectorStore.asRetriever({
        k
    });

    const documents = await retriever.invoke(query);

    return documents;
}

module.exports = {
    retrieveRelevantChunks
};