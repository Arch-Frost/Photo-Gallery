const express = require("express");
const router = express.Router();
const Image = require("../model/Image");
const multer = require("multer");
const axios = require("axios");

const storage = multer.memoryStorage(); // Store the file in memory as a buffer
const upload = multer({ storage: storage }); // Use the memory storage for multer

// Upload a new image with the user id
router.post("/images/upload", upload.single("image"), async (req, res) => {
  // The name of the file input field is "image"
  try {
    const { userId } = req.body;

    // Get the file details from the request
    const { originalname, buffer, mimetype } = req.file;

    // Encode the file buffer to base64
    const base64Image = buffer.toString("base64");

    // Check whether the user has enough space to upload the image
    const { canUpload, code } = await canUploadImage(userId, buffer.length);

    if (!canUpload) {
      response = {
        status: "fail",
        code: 400,
        message:
          "User has exceeded the storage limit. Please try again tomorrow!",
      };
      await axios
        .post(process.env.LOG_SERV_URL, {
          message: "StorageMgmtServ: User has exceeded the storage limit.",
          code: 400,
        })
        .then((res) => {
          // console.log("Logs saved successfully");
        })
        .catch((err) => {
          console.log("Error saving logs: " + err);
        });
      return res.status(400).json(response);
    }

    // Create a new Image document
    const newImage = new Image({
      userId: userId, // Get the user id from the request body
      imageName: originalname,
      imageSize: buffer.length,
      contentType: mimetype,
      image: Buffer.from(base64Image, "base64"),
    });

    // Save the image to the database
    await newImage.save();

    if (code == 199) {
      response = {
        status: "warning",
        code: 201,
        message: "Warning: User has exceeded 80% of the storage limit!",
        data: newImage,
      };
    } else {
      response = {
        status: "success",
        code: 201,
        message: "Image uploaded successfully!",
        data: newImage,
      };
    }

    await axios
      .post(process.env.LOG_SERV_URL, {
        message: "StorageMgmtServ: Image uploaded successfully",
        code: 201,
      })
      .then((res) => {
        // console.log("Logs saved successfully");
      })
      .catch((err) => {
        console.log("Error saving logs: " + err);
      });

    // Broadcasting that the image is uploaded to all other services
    await axios
    .post(process.env.EVENT_BUS_URL + "events/", {
    type: "IMAGE_UPLOADED",
    data: {
    userId: req.body.userId,
    imageSize: buffer.length,
    },
    })
    .then((res) => {
    console.log("Event bus responded with status " + res.status);
    })
    .catch((err) => {
    console.log("Event bus responded with error " + err);
    });

    // console.log(response);
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    response = {
      status: "fail",
      code: 500,
      message: "Internal Server Error. Error in upload image endpoint",
    };
    await axios
      .post(process.env.LOG_SERV_URL, {
        message:
          "StorageMgmtServ: Internal Server Error. Error in upload image endpoint",
        code: 500,
      })
      .then((res) => {
        // console.log("Logs saved successfully");
      })
      .catch((err) => {
        console.log("Error saving logs: " + err);
      });
    res.status(500).json(response);
  }
});

// Get all images for a user by user id from body
router.get("/images/:userId", async (req, res) => {
  try {
    // Get the user id from the request body
    const { userId } = req.params;

    if (!userId) {
      response = {
        status: "fail",
        code: 400,
        message: "Bad Request. User id is required",
      };
      await axios
        .post(process.env.LOG_SERV_URL, {
          message: "StorageMgmtServ: Bad Request. User id is required",
          code: 400,
        })
        .then((res) => {
          // console.log("Logs saved successfully");
        })
        .catch((err) => {
          console.log("Error saving logs: " + err);
        });
      return res.status(400).json(response);
    }

    // Find all images for the user
    const images = await Image.find({ userId: userId });

    response = {
      status: "success",
      code: 200,
      message: "Images retrieved successfully",
      data: images,
    };

    await axios
    .post(process.env.LOG_SERV_URL, {
    message: "StorageMgmtServ: Images retrieved successfully",
    code: 200,
    })
    .then((res) => {
    // console.log("Logs saved successfully");
    })
    .catch((err) => {
    console.log("Error saving logs: " + err);
    });

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    response = {
      status: "fail",
      code: 500,
      message: "Internal Server Error. Error in get images endpoint",
    };
    await axios
      .post(process.env.LOG_SERV_URL, {
        message:
          "StorageMgmtServ: Internal Server Error. Error in get images endpoint",
        code: 500,
      })
      .then((res) => {
        // console.log("Logs saved successfully");
      })
      .catch((err) => {
        console.log("Error saving logs: " + err);
      });
    res.status(500).json(response);
  }
});

// Delete an image by image id
router.delete("/images/delete/", async (req, res) => {
  try {
    // Get the image id from the request parameters
    const { imageId } = req.body;

    if (!imageId) {
      response = {
        status: "fail",
        code: 400,
        message: "Bad Request. Image id is required",
      };
      await axios.post(process.env.LOG_SERV_URL, {
        message: "StorageMgmtServ: Bad Request. Image id is required",
        code: 400,
      });

      return res.status(400).json(response);
    }

    const metaData = await Image.findOne({ _id: imageId });

    // Delete the image from the database
    await Image.deleteOne({ _id: imageId });

    console.log("Image deleted successfully");

    response = {
      status: "success",
      code: 200,
      message: "Image deleted successfully",
    };

    await axios
      .post(process.env.LOG_SERV_URL, {
        message: "StorageMgmtServ: Image deleted successfully",
        code: 200,
      })
      .then((res) => {
        // console.log("Logs saved successfully");
      })
      .catch((err) => {
        console.log("Error saving logs: " + err);
      });

    await axios
      .post(process.env.EVENT_BUS_URL + "events/", {
        type: "IMAGE_DELETED",
        data: {
          userId: metaData.userId,
          imageId: imageId,
          imageSize: metaData.imageSize,
        },
      })
      .then((res) => {
        console.log("Event bus responded with status " + res.status);
      })
      .catch((err) => {
        console.log("Event bus responded with error " + err);
      });

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    response = {
      status: "fail",
      code: 500,
      message: "Internal Server Error. Error in delete image endpoint",
    };
    await axios.post(process.env.LOG_SERV_URL, {
      message:
        "StorageMgmtServ: Internal Server Error. Error in delete image endpoint",
      code: 500,
    });
    res.status(500).json(response);
  }
});

// Get the available space for a user by user id
async function getUserAvailabelSpace(userId) {
  const request = await axios
    .get(process.env.USAGE_MNTR_SERV + "getUserStorage/" + userId)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return request.data.availableSpace;
}

// Check whether a user can upload an image of a certain size
async function canUploadImage(userId, imageSize) {
  const request = await axios
    .post(process.env.USAGE_MNTR_SERV + "canUploadImage/" + userId, {
      imageSize: imageSize,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      // console.log(error.data.code);
      return { canUpload: false, code: 403 };
    });

  return { canUpload: request.code === 200, code: request.code, message: request.message };
}

module.exports = router;
