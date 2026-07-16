function formatRepositoryForLLM(repo) {
    let formattedRepository = "";

    repo.forEach((file) => {
        const path = file.metadata?.path || file.path || "unknown";
        const content = file.pageContent || file.content || "";
        formattedRepository += `====================================\n`;
        formattedRepository += `File: ${path}\n\n`;
        formattedRepository += `${content}\n\n`;
    });

    return formattedRepository;
}

module.exports = { formatRepositoryForLLM };