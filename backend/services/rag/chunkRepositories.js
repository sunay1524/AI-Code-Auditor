
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { Document } = require("@langchain/core/documents");
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP
});

async function chunkRepo(repo)
{
    const chunks = [];
    for(const file of repo)
    {
        const docs = await splitter.createDocuments([file.content]);
        
        for(const doc of docs)
        {
            chunks.push(
                new Document({
                    pageContent: doc.pageContent,
                    metadata: {
                        path: file.path
                    }
                })
            );
        }
    }

    return chunks;
}

module.exports = {chunkRepo};