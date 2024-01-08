// import express from "express";

const {forgotPasswordController,sendOtp, getAllOrdersController, getOrdersController, loginController, orderStatusController, registerController,  updateProfileController} =require("../controllers/authController")
const { isAdmin, requireSignIn } =require("../middlewares/authMiddleware.js");
const express=require('express');


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
// //test routes
// router.get("/test", requireSignIn, isAdmin, testController);

// //protected User route auth
// router.get("/user-auth", requireSignIn, (req, res) => {
//   res.status(200).send({ ok: true });
// });
// // //protected Admin route auth
// router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
//   res.status(200).send({ ok: true });
// });

// //update profile
router.put("/profile", updateProfileController);

// //orders
// router.get("/orders", getOrdersController);

// //all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// // order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);
module.exports=router;
