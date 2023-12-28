const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');

// User registration
router.post('/register', async (req, res) => {
  try {
    // Register a new user
    const { username, password } = req.body;
    let email = req.body.email.toLowerCase();
    const user = new User({ username, email, password });
    await user.save();
    response = user.toJSON();
    console.log(response);
    delete response.password;
    
    // Log the user registration
    await axios.post(process.env.LOG_SERV_URL, {
      message: "UserAccMgmtServ: User registered with email " + email,
      code: 201,
    }).then((res) => {
      console.log("Logs saved successfully");
    }).catch((err) => {
      console.log("Error saving logs: " + err);
    });

    // Send the response
    res.status(201).json(response);

  } catch (error) { // Catch any errors
    response = {
      message: 'User registration failed',
      error: error.message,
    };

    // Log the error
    await axios.post(process.env.LOG_SERV_URL, {
      message: "UserAccMgmtServ: User registration failed with error " + error.message,
      code: 500,
    }).then((res) => {
      console.log("Logs saved successfully");
    }).catch((err) => {
      console.log("Error saving logs: " + err);
    });
    res.status(500).json(response);
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    // Login an existing user
    const { password } = req.body;
    let email = req.body.email.toLowerCase();
    console.log(req.body);
    const user = await User.findOne({ email });

    // Match the password
    const isPasswordValid = await user.comparePassword(password);
    if (user && isPasswordValid) {
      userDetails = user.toJSON();
      delete userDetails.password;

      response = {
        status: 'success',
        code: 200,
        message: 'User logged in successfully',
        data: userDetails,
      };
      res.status(200).json(response);
      
      // Log the user login
      await axios.post(process.env.LOG_SERV_URL, {
        message: "UserAccMgmtServ: User logged in with email " + email,
        code: 200,
      }).then((res) => {
        console.log("Logs saved successfully");
      }).catch((err) => {
        console.log("Error saving logs: " + err);
      });
    } else { // If the password is invalid
      response = {
        status: 'fail',
        code: 401,
        message: 'Invalid credentials',
      };
      res.status(401).json(response);

      // Log the user login failure
      await axios.post(process.env.LOG_SERV_URL, {
        message: "UserAccMgmtServ: User login failed due to invalid credentials with email " + email,
        code: 401,
      }).then((res) => {
        console.log("Logs saved successfully");
      }).catch((err) => {
        console.log("Error saving logs: " + err);
      });
    }
  } catch (error) { // Catch any errors
    response = {
      message: 'User login failed',
      error: error.message,
    };

    // Log the error
    await axios.post(process.env.LOG_SERV_URL, {
      message: "UserAccMgmtServ: User login failed with error " + error.message,
      code: 500,
    }).then((res) => {
      console.log("Logs saved successfully");
    }).catch((err) => {
      console.log("Error saving logs: " + err);
    });
    res.status(500).json(response);
  }
});

module.exports = router;