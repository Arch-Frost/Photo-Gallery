const mongoose = require("mongoose");

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully!");
  })
  .catch((err) => {
    console.log(err);
  });

// Define the image schema
const imageSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  imageName: String,
  imageSize: Number,
  contentType: String,
  image: Buffer,
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
