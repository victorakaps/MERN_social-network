const express = require("express");
const mongoose = require("mongoose");

const app = express();

const { MONGO_URI } = require("./keys");

mongoose.connect(MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("connected to db");
});

mongoose.connection.on("error", () => {
  console.error("error connecting to db");
});

require("./models/user");
require("./models/post");

app.use(express.json());

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

const customMiddleware = (req, res, next) => {
  console.log("middleware");
  next();
};

if (process.env.NODE_ENV == "production") {
  app.use(express.static("frontend/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.res(__dirname, "frontend", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is up at ${PORT}`);
});
