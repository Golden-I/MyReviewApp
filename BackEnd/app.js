const express = require("express");
const db = require("../BackEnd/db"); // Assuming this is the module for connecting to the database
const userRouter = require("../BackEnd/controller/user");
const app = express();
app.use(express.json());

const port = process.env.PORT || 8000; // Use uppercase 'PORT' for environment variable

app.use("/api/user", userRouter);

app.post("/sign-in", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email or password missing!" });
  }

  // TODO: Implement authentication logic here

  next(); // Call next() to move on to the next middleware or route handler
});

// app.get("/about", (req, res) => {
//   res.send("<h1>Hello I am from your backend about</h1>");
// });

// Listen for requests
app.listen(port, () => console.log(`Server is running on port ${port}`));
