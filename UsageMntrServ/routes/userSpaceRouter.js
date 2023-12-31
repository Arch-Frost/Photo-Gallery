const express = require("express");
const router = express.Router();
const cron = require('node-cron');

const UserSpace = require("../model/UserSpace");

const MAX_STORAGE_LIMIT_MB = 10;
const MAX_SPACE_LIMIT = MAX_STORAGE_LIMIT_MB * 1024 * 1024; // Convert MB to bytes

const MAX_DAILY_BANDWIDTH_MB = 25;
const MAX_DAILY_BANDWIDTH = MAX_DAILY_BANDWIDTH_MB * 1024 * 1024; // Convert MB to bytes


// Schedule task to run at midnight
cron.schedule("0 0 * * *", async function () {
  // Get all users
  const users = await UserSpace.find({});

  // Reset daily bandwidth for each user
  users.forEach(async (user) => {
    user.dailyBandwidth = 0;
    await user.save();
    console.log("Reset daily bandwidth for user " + user.userId);
  });
});

// Endpoint to check whether a user has enough space to upload an image
router.post("/canUploadImage/:userId/", async (req, res) => {
  try {
    const { userId } = req.params;
    const { imageSize } = req.body;

    if (!imageSize) {
      response = {
        status: "error",
        code: 400,
        message: "imageSize is required in the request body.",
      };
      return res.status(400).json(response);
    }

    let currentUser = await UserSpace.findOne({ userId });
    // console.log("Current User: ", currentUser);

    if (!currentUser) {
      currentUser = new UserSpace({ userId });
      await currentUser.save();
    }

    // Check if the user has enough bandwidth to upload the image
    const currentBandwidth = Number(currentUser.dailyBandwidth);

    if (currentBandwidth + Number(imageSize) > MAX_DAILY_BANDWIDTH) {
      console.log(
        `User with ID ${userId} has exceeded the daily bandwidth limit.`
      );
      response = {
        status: "error",
        code: 403,
        message: "User has exceeded the daily bandwidth limit.",
        data: {
          userId,
          dailyBandwidth: currentUser.dailyBandwidth,
          availableBandwidth: MAX_DAILY_BANDWIDTH - currentUser.dailyBandwidth,
        },
      };
      res.status(403).json(response);
      return;
    }

    // Check if the user has enough space to upload the image
    const newUsedSpace = Number(currentUser.usedSpace) + Number(imageSize);

    if (newUsedSpace > MAX_SPACE_LIMIT) {
      // If the user has exceeded the storage limit
      console.log(`User with ID ${userId} has exceeded the storage limit.`);
      response = {
        status: "error",
        code: 403,
        message: "User has exceeded the storage limit.",
        data: {
          userId,
          usedSpace: currentUser.usedSpace,
          availableSpace: MAX_SPACE_LIMIT - currentUser.usedSpace,
        },
      };
      res.status(403).json(response);
      return;
    }

    if (newUsedSpace > 0.8 * MAX_SPACE_LIMIT) {
      // If the user has exceeded 80% of the storage limit
      console.log(
        `Alert: User with ID ${userId} has exceeded 80% of the storage limit.`
      );
      // You can implement your alert mechanism here (e.g., send an email, notification, etc.)
      response = {
        status: "warning",
        code: 200,
        message: "Warning: User has exceeded 80% of the storage limit.",
        data: {
          userId,
          usedSpace: currentUser.usedSpace,
          availableSpace: MAX_SPACE_LIMIT - currentUser.usedSpace,
        },
      };
      res.status(200).json(response);
      return;
    }

    response = {
      status: "success",
      code: 200,
      message: "User has enough space to upload the image.",
      data: {
        userId,
        usedSpace: currentUser.usedSpace,
        availableSpace: MAX_SPACE_LIMIT - currentUser.usedSpace,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    // Catch any errors
    console.error(error);
    response = {
      status: "error",
      code: 500,
      message: "Internal server error. Error with middleware function.",
    };
    res.status(500).json(response);
  }
});

// Gets the user storage information
router.get("/getUserStorage/:userId/", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      // If the userId is not provided
      response = {
        status: "error",
        code: 400,
        message: "userId is required in the request query.",
      };
      return res.status(400).json(response);
    }

    let currentUser = await UserSpace.findOne({ userId });

    if (!currentUser) {
      // If the user does not exist
      currentUser = new UserSpace({ userId });
      await currentUser.save();
    }

    // Return the user storage information
    response = {
      status: "success",
      code: 200,
      message: "Successfully retrieved user storage.",
      data: {
        userId,
        usedSpace: currentUser.usedSpace,
        availableSpace: MAX_SPACE_LIMIT - currentUser.usedSpace,
        dailyBandwidth: currentUser.dailyBandwidth,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    // Catch any errors
    console.error(error);
    response = {
      status: "error",
      code: 500,
      message: "Internal server error. Error with getUserStorage endpoint.",
    };
    res.status(500).json(response);
  }
});

module.exports = router;
