require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Log = require("./model/Log");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5004;

app.get("/", (req, res) => {
  res.send("Hello from Log Service!");
});

app.post("/", async (req, res) => {
  const { message, code } = req.body;
  const log = new Log({
    message: message,
    code: code,
  });
  await log
    .save()
    .then((res) => {
      console.log("Logged: " + message + " with code " + code);
    })
    .catch((err) => {
      console.log("Error in saving log: " + err);
    });
  res.send({ status: "OK" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
