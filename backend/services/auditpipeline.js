const { generateAuditReport } = require("./aiservice");
const { fetchRepoContents } = require("./githubService");


function processRepoContents(repoContents) {
    const repoContent = repoContents.files;
    return repoContent;

}

async function runAuditPipeline(repoUrl) {
    const repoContents = await fetchRepoContents(repoUrl);


    const processContent = processRepoContents(repoContents);
    const formatedReport = await generateAuditReport(processContent);

    return formatedReport;
}



module.exports = { runAuditPipeline };