const express = require("express");
const app = express();
const dotenv = require("dotenv");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/user");
dotenv.config();
const mongoose = require("mongoose");
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
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("MongoDB connected");
    }).catch((err) => {
        console.log(err);
    });
});



// go and study about how to make api without any package, using nodejs only -> xhr