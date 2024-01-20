// import express from "express";

const { forgotPasswordController, sendOtp, loginController, registerController, updateProfileController, verifyOtp } = require("../controllers/authController");
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

router.post("/sent-otp", sendOtp);

router.post("/verifyOtp", verifyOtp);
// //update profile
router.put("/profile", updateProfileController);


module.exports = router;
