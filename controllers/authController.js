const userModel = require("../models/userModel.js");
const orderModel = require("../models/orderModel.js");
const shortid = require("shortid");
const {
  comparePassword,
  hashPassword,
  generateOTP,
} = require("../helpers/authHelper.js");
const twilio = require("twilio");
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, userReferCode } = req.body;
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
   
    if (await userModel.findOne({ email: email })) {
      res.status(202).json({
        status: false,
        massage: "Email already exits!!!",
      });
    }

    let referredByUser = null;

    if (userReferCode) {
      referredByUser = await userModel.findOne({ referralCode: userReferCode });
      if (referredByUser) {
        updateUserMoney(referredByUser.email);
      }
    }

    const newUser = new userModel({
      name,
      email,
      password: password,
      phone,
      address,
      money: 100,
      referredBy: referredByUser ? referredByUser._id : null,
      referralCode: shortid.generate(),
      userReferCode,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      massage: "Something went wrong while sign up",
    });
  }
};

const updateUserMoney = async (UserEmail, newMoneyValue = undefined) => {
  referredByUser = await userModel.findOne({ email: UserEmail });
  console.log("referredByUser.isRefered", typeof referredByUser.isRefered, referredByUser.isRefered);
  const newMoney =
    +referredByUser.money +
    (newMoneyValue ? newMoneyValue : referredByUser.isRefered ? 50 : 100);
  console.log(newMoney);
  userModel.updateOne(
    { email: UserEmail },
    {
      $set: {
        money: newMoney,
        isRefered: true,
      },
    },
    (err, result) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Money updated successfully for user with ID`, result);
      }
    }
  );
};

//POST LOGIN
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forgotPasswordController
const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//update prfole
const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

const sendOtp = async (req, res) => {
  const accountSid = "AC83f3835404f95ea8eea0b1cf3031c06a";
  const authToken = "3d3ac7c3ee187bf8467af66e1b8c6f1a";
  const client = new twilio(accountSid, authToken);
  const phoneNumber = req.body.phoneNumber;
  const otp = generateOTP();
  client.messages
    .create({
      body: `\n\nYour OTP for Riotinto signup is  ${otp}`,
      to: "+91" + phoneNumber,
      from: "+17179644830",
    })
    .then((message) => {
      res.send({
        status: true,
        data: otp,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({
        status: false,
        data: "Failed to send OTP!!!",
      });
    });
};

module.exports = {
  sendOtp,
  registerController,
  loginController,
  forgotPasswordController,
  orderStatusController,
  getAllOrdersController,
  getOrdersController,
  updateProfileController,
};
