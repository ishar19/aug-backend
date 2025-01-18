const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
const applicationModel = require("../models/application.model");

// get id from token
// get user from that id 

router.get("/", async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user).status(200);
    }
    catch (err) {
        next(err);
    }
});

router.delete("/", async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" }).status(200);
    }
    catch (err) {
        next(err);
    }
});

router.put("/", async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await userModel.findByIdAndUpdate(id, req.body);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user).status(200);
    }
    catch (err) {
        next(err);
    }
});
// /api/user/jobs?createdJobs=true&savedJobs=false&appliedJobs=true
router.get("/jobs", async (req, res, next) => {
    try {
        const { createdJobs, savedJobs, appliedJobs } = req.query;
        const jobs = await userModel.findById(req.user.id);
        if (!jobs) {
            return res.status(404).json({ message: "User not found" });
        }
        const query = {};
        if (createdJobs) {
            query.createdJobs = true;
        }
        if (savedJobs) {
            query.savedJobs = true;
        }
        if (appliedJobs) {
            query.appliedJobs = true;
        }
        else {
            const jobs = await userModel.findById(req.user.id).select({ ...query });
            return res.json(jobs).status(200);
        }
    }
    catch (err) {
        next(err);
    }
})

router.get("/status", async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const applications = await applicationModel.find({ user: id });

    const acceptedApplications = applications.filter(
      (app) => app.status === "accepted"
    );
    const pendingApplications = applications.filter(
      (app) => app.status === "pending  "
    );
    const rejectedApplications = applications.filter(
      (app) => app.status === "rejected"
    );

    return res
      .json({ acceptedApplications, pendingApplications, rejectedApplications })
      .status(200);
  } catch (err) {
    next(err);
  }
});
router.get("/count", async (req, res, next) => {
  try {
    const { id } = req.user;

    const applications = await applicationModel.find({ user: id });

    const count = {
      accepted: applications.filter((app) => app.status === "accepted").length,
      pending: applications.filter((app) => app.status === "pending").length,
      rejected: applications.filter((app) => app.status === "rejected").length,
    };

    return res.status(200).json(count);
  } catch (err) {
    next(err);
  }

  //total applications

  router.get("/total", async (req, res, next) => {
    try {
      const { id } = req.user;

      const totalApplications = await applicationModel.countDocuments({
        user: id,
      }); //method tto count the number of documents

      return res.status(200).json({ totalApplications });
    } catch (err) {
      next(err);
    }
  });
});
// create filters for pending and rejected
// create apis for counting applications (individually) and (cumulatively)

module.exports = router;
