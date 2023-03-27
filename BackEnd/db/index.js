const mongoose = require("mongoose");
//const mongoose = require("mongoose"); to run the server
mongoose
  .connect("mongodb://localhost:27017/MyReviewApp")

  .then(() => {
    console.log("db is connected");
  })
  .catch((ex) => {
    console.log("db connection failed: ", ex);
  });
