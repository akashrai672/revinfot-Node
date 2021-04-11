const { json } = require("express");
const express = require("express");
const ApiRoutes = require("./routes/api");
const fileUpload = require("express-fileupload");
const app = express();
const port = 3000;
require("./CoreDB/db");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use("/api", ApiRoutes);

app.get("/", (req, res) => {
  res.send("Hello, it's my starting url");
});
app.listen(port, () => {
  console.log(`Server is Listening on port ${port}`);
});
