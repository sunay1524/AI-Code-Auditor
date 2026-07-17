const express = require("express")
const auditRouter = require("./routes/auditRouter")
const cors = require("cors")
const app = express()

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:5174"
  ].filter(Boolean),
  credentials: true
}));

app.use(express.json())

app.use("/api/audit", auditRouter)

// Put this before your routes!





module.exports = app
