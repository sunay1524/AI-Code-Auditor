const express = require("express")
const { repoUrlcontroller, fetchAuditscontroller, fetchAllcontroller } = require("../controllers/auditcontrollers")
const auditRouter = express.Router()
const { fetchRepoContents } = require("../services/githubService")

auditRouter.post("/", repoUrlcontroller)
auditRouter.get("/all", fetchAllcontroller)
auditRouter.get("/:id", fetchAuditscontroller)




module.exports = auditRouter
