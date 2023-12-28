require("dotenv").config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const uploadRoutes = require("./routes/imageRouter");


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/', uploadRoutes);

const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("Hello from Storage Management Service!");
});

app.post("/events", async (req, res) => {
  console.log("Received POST request for /events with type " + req.body.type);
  res.send({ status: "OK" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
