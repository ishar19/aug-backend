const { application } = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jobSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    application: {
        type: [Schema.Types.ObjectId],
        ref: "Application",
        required: true,
    },
});
module.exports = mongoose.model("Job", jobSchema);


// read about indexes, primary keys, and unique keys, foreign keys, and references in mongoDb