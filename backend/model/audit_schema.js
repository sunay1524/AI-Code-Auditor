const mongoose = require("mongoose")

const audit_schema = mongoose.Schema({

    repoUrl: {
        type: String,
        required: true,

    },

    repoName: {
        type: String,
        required: true

    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "completed", "failed"]
    },
    result: {
        type: Object
    },
    error: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const auditModel = mongoose.model("audit", audit_schema)
module.exports = auditModel

