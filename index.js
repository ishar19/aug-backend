const express = require("express");
const app = express();
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/user");
dotenv.config();
const PORT = process.env.PORT || 3000;
app.use(errorHandler)
app.use('/api/user', userRoutes);
app.get("/", (req, res, next) => {
    try {
        res.send("Hello World!");
    } catch (err) {
        next(err);
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});