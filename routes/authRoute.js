// import express from "express";

const { forgotPasswordController, sendOtp, loginController, registerController, updateProfileController } = require("../controllers/authController");
const express = require('express');


// //router object
const router = express.Router();

// //routing
// //REGISTER || METHOD POST
router.post("/register", registerController);

// //LOGIN || POST
router.post("/login", loginController);

// //Forgot Password || POST
router.post("/forgot-password", forgotPasswordController);

router.get("/sent-otp", sendOtp);

// //update profile
router.put("/profile", updateProfileController);


module.exports = router;
