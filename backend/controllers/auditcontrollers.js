const auditModel = require("../model/audit_schema")
const { generateFinalReport } = require("../services/agents/CoordinatorAgent")
const { runAuditPipeline } = require("../services/auditpipeline")
const isValidGithubUrl = (repoUrl) => {
    const pattern = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/
    return pattern.test(repoUrl)  // ✅ using repoUrl not url
}

async function repoUrlcontroller(req, res) {
    let repo = null

    try {
        const { repoUrl } = req.body

        if (!repoUrl) {
            return res.status(400).json({ message: "Repo URL is required" })
        }

        if (!isValidGithubUrl(repoUrl)) {
            return res.status(400).json({ message: "Please enter a valid GitHub URL" })
        }

        const cleanUrl = repoUrl.replace(/\/$/, "");
        const repoName = cleanUrl.split('/').slice(-2).join('/')

        // upsert: if same repo was audited before, update it — otherwise create a new entry
        repo = await auditModel.findOneAndUpdate(
            { repoUrl: cleanUrl },
            { repoName, status: "pending", result: null, error: null },
            { upsert: true, returnDocument: 'after' }
        )

        // run the audit pipeline (fetches files + generates LLM report)
        const auditReport = await runAuditPipeline(cleanUrl)

        // update status to completed and save results
        await auditModel.findByIdAndUpdate(
            repo._id,
            { status: "completed", result: auditReport, updatedAt: new Date() }
        )

        return res.status(201).json({
            report: auditReport,
            audit : repo
        })

    } catch (error) {
        // mark as failed if we already created/found the DB entry
        if (repo) {
            await auditModel.findByIdAndUpdate(repo._id, {
                status: "failed",
                error: error.message,
                updatedAt: new Date()
            })
        }
        return res.status(500).json({ message: error.message })
    }
}



async function fetchAuditscontroller(req, res) {
    try {
        const { id } = req.params  // this is how you get the :id from the URL

        const audit = await auditModel.findById(id)

        // what if someone passes a valid format id but it doesn't exist in db?
        if (!audit) {
            return res.status(404).json({ message: "Audit not found" })
        }

        return res.status(200).json(audit)

    } catch (error) {
        // if id format is invalid, mongoose throws a CastError
        return res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

async function fetchAllcontroller(req, res) {
    try {
        const { ids } = req.query;
        if (!ids) {
            return res.status(200).json([]);
        }

        const idList = ids.split(",");
        const audits = await auditModel.find({ _id: { $in: idList } });

        return res.status(200).json(audits);
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

module.exports = { repoUrlcontroller, fetchAuditscontroller, fetchAllcontroller }
