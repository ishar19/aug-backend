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
    salary: {
        type: Number,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    remote: {
        type: Boolean,
        required: true,
        default: false,
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
        default: [],
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
module.exports = mongoose.model("Job", jobSchema);


// read about indexes, primary keys, and unique keys, foreign keys, and references in mongoDb