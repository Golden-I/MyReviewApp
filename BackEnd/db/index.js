const mongoose = require("mongoose");
//const mongoose = require("mongoose"); to run the server
mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {
    console.log("db is connected");
  })
  .catch((ex) => {
    console.log("db connection failed: ", ex);
  });
