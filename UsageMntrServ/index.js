require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const UserSpace = require("./model/UserSpace");
const userSpaceRouter = require("./routes/userSpaceRouter");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", userSpaceRouter);

const port = process.env.PORT || 5002;

// Schedule task to run at midnight
cron.schedule('0 0 * * *', async function() {
  // Get all users
  const users = await UserSpace.find({});
  
  // Reset daily bandwidth for each user
  users.forEach(async (user) => {
    user.dailyBandwidth = 0;
    await user.save();
  });
});

// Update the daily bandwidth used by the user
async function useDailyBandwidth(userId, bandwidth) {
  await UserSpace.findOneAndUpdate(
    { userId: userId },
    { $inc: { dailyBandwidth: bandwidth } }
  ).then((res) => {
    console.log("Successfully updated daily bandwidth");
  }).catch((err) => {
    console.log("Error in updating daily bandwidth: " + err);
  });
  
};

app.get("/", (req, res) => {
  res.send("Hello from Usage Monitoring Service!");
});

// Receive events from the event bus
app.post("/events", async (req, res) => {
  console.log("Received POST request for /events with type " + req.body.type);
  const { userId, imageSize } = req.body.data;
  const { type } = req.body;
  console.log("User id is " + userId);
  console.log("The image size is " + (imageSize / (1024 * 1024)).toFixed(2) + " MB");
  console.log("The event type is " + type + " with type " + typeof(type));
  console.log(type == "IMAGE_UPLOADED");
  console.log(req.body.type == "IMAGE_DELETED");

  if (type == "IMAGE_UPLOADED") { // If the event type is IMAGE_UPLOADED
    await UserSpace.findOneAndUpdate(
      { userId: userId },
      { $inc: { usedSpace: imageSize } }
      ).then((res) => {
        console.log("User uploaded image successfully");
      }).catch((err) => {
        console.log("Error in uploading image: " + err);
      });
    
      useDailyBandwidth(userId, imageSize);
      await axios.post(process.env.LOG_SERV_URL, {
        message: "UsageMntrServ: User uploaded image successfully",
        code: 200,
      }).then((res) => {
        console.log("Log Service responded with status " + res.status);
      }).catch((err) => {
        console.log("Log Service responded with error " + err);
      });
  };

  
  if (type == "IMAGE_DELETED") { // If the event type is IMAGE_DELETED
    await UserSpace.findOneAndUpdate(
      { userId: userId },
      { $inc: { usedSpace: -imageSize } }
      ).then((res) => {
        console.log("User deleted image successfully");
      }).catch((err) => {
        console.log("Error in deleting image: " + err);
      });

      await axios.post(process.env.LOG_SERV_URL, {
        message: "UsageMntrServ: User deleted image successfully",
        code: 200,
      }).then((res) => {
        console.log("Log Service responded with status " + res.status);
      }).catch((err) => {
        console.log("Log Service responded with error " + err);
      });
  };

  res.send({ status: "OK" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
