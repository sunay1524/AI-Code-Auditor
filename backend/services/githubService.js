const { Octokit } = require("@octokit/rest")

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

// extracts owner and repo from URL
function parseRepoUrl(repoUrl) {
    const cleanUrl = repoUrl.replace(/\/$/, "");
    const parts = cleanUrl.split('/')
    return {
        owner: parts[parts.length - 2],
        repo: parts[parts.length - 1]
    }
}

// checks if we should read this file or skip it
function shouldIncludeFile(filename) {
    const skipExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip']
    const skipFolders = ['node_modules', '.git', 'dist', 'build', '.next']

    // skip binary/image files
    if (skipExtensions.some(ext => filename.endsWith(ext))) return false

    // skip build folders
    if (skipFolders.some(folder => filename.includes(folder))) return false

    return true
}

async function fetchRepoContents(repoUrl) {
    const { owner, repo } = parseRepoUrl(repoUrl)

    try {
        // Step 1 — get the full file tree of the repo
        const { data: treeData } = await octokit.rest.git.getTree({
            owner,
            repo,
            tree_sha: 'HEAD',
            recursive: 'true'  // gets all files in all folders
        })

        // Step 2 — filter to only files we care about (not folders, not images)
        const files = treeData.tree.filter(item =>
            item.type === 'blob' && shouldIncludeFile(item.path)
        )

        // Step 3 — limit to 20 files max so we don't overload the AI later
        const filesToFetch = files.slice(0, 20)

        // Step 4 — fetch content of each file
        const fileContents = await Promise.all(
            filesToFetch.map(async (file) => {
                try {
                    const { data } = await octokit.rest.repos.getContent({
                        owner,
                        repo,
                        path: file.path
                    })

                    // github returns content as base64 — decode it
                    const content = Buffer.from(data.content, 'base64').toString('utf-8')

                    return {
                        path: file.path,
                        content: content.slice(0, 3000)  // limit each file to 3000 chars
                    }
                } catch (err) {
                    // if one file fails, don't crash everything — just skip it
                    return null
                }
            })
        )

        // Step 5 — remove any files that failed to fetch
        const validFiles = fileContents.filter(file => file !== null)

        return {
            owner,
            repo,
            totalFiles: validFiles.length,
            files: validFiles
        }

    } catch (error) {
        // repo doesn't exist or is private
        if (error.status === 404) {
            throw new Error("Repository not found or is private")
        }
        throw new Error("Failed to fetch repository contents")
    }
}

module.exports = { fetchRepoContents }

