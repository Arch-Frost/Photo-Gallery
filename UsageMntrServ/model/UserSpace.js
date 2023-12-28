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


  // Define the user space schema
const userSpaceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  usedSpace: {
    type: Number,
    required: true,
    default: 0, // Initial used space is set to 0
  },
  dailyBandwidth: {
    type: Number,
    required: true,
    default: 0, // Initial daily bandwidth is set to 0
  },
});

const UserSpace = mongoose.model("UserSpace", userSpaceSchema);

module.exports = UserSpace;
