const express = require("express");
const router = express.Router();



router.get("/", (req, res, next) => {
    try {
        res.send("Hello route!");
    } catch (err) {
        next(err);
    }
});


module.exports = router;