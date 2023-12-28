require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", authRoutes);

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello from User Authentication Service!");
});

app.post("/events", async (req, res) => {
  console.log("Received POST request for /events with type " + req.body.type);
  res.send({ status: "OK" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 