const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password, mobile } = req.body;
        console.log(req.body);
        console.log(name, email, password, mobile);
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = new userModel({
            name,
            email,
            mobile,
            password: hashedPassword,
        });
        await user.save();
        res.json({ message: "User registered successfully" }).status(200);
    }
    catch (err) {
        next(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }
        const payload = {
            id: user._id,
            name: user.name,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY);
        res.json({ token, message: "Login successful" }).status(200);
    }
    catch (err) {
        next(err);
    }
});

module.exports = { authRoutes: router };