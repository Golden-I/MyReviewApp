const express = require("express");
require("../BackEnd/db");
// const dotenv = require("dotenv").config();
const userRouter = require("../BackEnd/routes/user");
const app = express();
app.use(express.json());
//this method confirm anything come from front end to json format

const port = process.env.port || 8000;

app.use("/api/user", userRouter);

app.post("/sign-in", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email or password missing!" });
  }
});

// app.get("/about", (req, res) => {
//   res.send("<h1>Hello I am from your backend about</h1>");
// });

//listen for requests
app.listen(port, () => console.log(`Server is running on port ${port}`));
