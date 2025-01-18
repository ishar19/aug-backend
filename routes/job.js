const express = require("express");
const router = express.Router();
const jobModel = require("../models/job.model");
const applicationModel = require("../models/application.model");
const userModel = require("../models/user.model");
const authMiddleware = require("../middleware/auth");
// creating a job

// css,nodejs, javascript
router.post("/", authMiddleware, async (req, res, next) => {

    try {

        const { title, description, salary, skills, location, remote } = req.body;
        const serialsiedSkills = skills.split(",").map(skill => skill.trim());
        const job = new jobModel({
            title,
            description,
            salary,
            skills: serialsiedSkills,
            location,
            remote,
        });
        const updatedUser = await userModel.findByIdAndUpdate(req.user.id, { $push: { createdJobs: job._id } });
        // const user = await userModel.findById(req.user.id);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        job.createdBy = req.user.id;
        await job.save();
        // res.json({ message: "Job created successfully" }).status(200);
    }
    catch (err) {
        next(err);
    }
})


// add filters for pending and rejected
router.get("/", async (req, res, next) => {
    try {
        const jobs = await jobModel.find();
        res.json(jobs).status(200);
    }
    catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const job = await jobModel.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json(job).status(200);
    }
    catch (err) {
        next(err);
    }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {

    try {

        const { id } = req.params;
        const job = await jobModel.findByIdAndDelete(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (job.createdBy.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this job" });
        }
        else {
            const updatedJob = await jobModel.findByIdAndUpdate(id, { isDeleted: true });
        }
        res.json({ message: "Job deleted successfully" }).status(200);
        // remove it from user's created jobs
    }
    catch (err) {
        next(err);
    }
})


router.post("/:id/apply", authMiddleware, async (req, res, next) => {

    try {
        // create an application 
        // add the id to job applications
        // add it to user applied jobs if they are not creator or already applied

        const { id } = req.params;
        const job = await jobModel.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        const application = new applicationModel({
            job: id,
            user: req.user.id,
            status: "pending",
        });
        await application.save();
        const updatedJob = await jobModel.findByIdAndUpdate(id, { $push: { application: application._id } });
        const user = await userModel.findById(req.user.id);
        if (user.appliedJobs.includes(id)) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }
        if (user.createdJobs.includes(id)) {
            return res.status(400).json({ message: "Cannot apply for your own job" });
        }
        user.appliedJobs.push(id);
        await user.save();
        await updatedJob.save();
        res.json({ message: "Application submitted successfully" }).status(200);

    }
    catch (err) {
        next(err);
    }
});


// select an application
router.get("/:id/application", authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const application = await applicationModel.findById(id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        const jobId = application.job;
        const job = await jobModel.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        const creator = job.createdBy;
        if (creator.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: "You are not authorized to view this application" });
        }
        else {
            application.status = "accepted";
            await application.save();
            return res.json(application).status(200);
        }

    }
    catch (err) {
        next(err);
    }
});