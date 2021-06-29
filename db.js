const mongoose = require("mongoose");
const { mongoURI } = require("./config");

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected succesfully with mongoDB");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
