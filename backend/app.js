const express = require("express")
const auditRouter = require("./routes/auditRouter")
const cors = require("cors")
const app = express()

app.use(cors({
  origin: "http://localhost:5174",
  credentials: true
}));

app.use(express.json())

app.use("/api/audit", auditRouter)

// Put this before your routes!





module.exports = app
