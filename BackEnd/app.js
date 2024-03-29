const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const db = require("../BackEnd/db"); // Assuming this is the module for connecting to the database
const userRouter = require("./routes/user");
require("express-async-errors");
const { errorHandler } = require("./middlewares/error");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const port = process.env.PORT || 8000; // Use uppercase 'PORT' for environment variable

app.use("/api/user", userRouter);

app.use(errorHandler);

// app.post("/sign-in", (req, res, next) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ error: "email or password missing!" });
//   }

//   next(); // Call next() to move on to the next middleware or route handler
// });

// Listen for requests
app.listen(port, () => console.log(`Server is running on port ${port}`));
