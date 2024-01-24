const userModel = require("../models/userModel.js");
const shortid = require("shortid");
const {
  hashPassword,
  generateOTP,
} = require("../helpers/authHelper.js");
const JWT = require("jsonwebtoken");
const sdk = require('api')('@telesign-enterprise/v1.0#55lb030lqba2f1f');


const accountSid = "ACed105a8cab8085c03bd58cfca1d3e48c";
const authToken = "f7614b8428cc4d945e0e992af2647b98";
const serviceSid = "VAc5593ff31f6aff02ab4503d7d3e818c4";

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
    const oldUser = await userModel.findOne({ phone: phone });
    const oldUserEmail = await userModel.findOne({ email: email });
    console.log(oldUser);
    if (oldUser && oldUser._id) {
      await res.status(202).json({
        status: false,
        massage: "Phone already exits!!!",
      });
      return;
    }
    if (oldUserEmail && oldUserEmail._id) {
      await res.status(202).json({
        status: false,
        massage: "Email already exits!!!",
      });
      return;
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
    const { phone, password } = req.body;
    //validation
    if (!phone || !password) {
      return res.status(301).send({
        success: false,
        message: "Invalid phone or password",
      });
    }
    //check user
    const user = await userModel.findOne({ phone });
    if (!user) {
      return res.status(201).send({
        success: false,
        message: "phone is not registered",
      });
    }
    if (password !== user.password) {
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
      res.status(400).send({ message: "Email is required" });
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

//update profile
const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and 6 character long" });
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

const sendOtp = async (req, res) => {
  const phoneNumber = req.body.phoneNumber;
  try {
    const otp = generateOTP()
    sdk.auth('C1C7CFC7-2B36-46D6-B841-AEDD859E1E50', 'eKEHCozjEtsV49WdkQ3dbGPZH5Sx2PKz50iEUx85xikGvZ5W93DhxJIeg7RlO38YUgyGt9nkynA2HvWmDOVdQQ==');
    sdk.sendSMSVerifyCode({ is_primary: 'true', phone_number: '91' + phoneNumber, verify_code: otp })
      .then(({ data }) => {
        res.json({ status: true, data, otp })
      })
      .catch(err => res.json({ status: false, error: err }));
  } catch (error) {
    res.json({ status: false, error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { phoneNumber, code } = req.body;
  try {
    const client = require('twilio')(accountSid, authToken);
    const check = await client.verify.v2.services(serviceSid).verificationChecks.create({
      to: "+91" + phoneNumber,
      code,
    })
      .then(verification => {
        res.json({ status: true, verification })
      })
      .catch(err => res.json({ status: false, error: err.message }));

  } catch (error) {
    res.json({ status: false, error: error.message });
  }
};

module.exports = {
  verifyOtp,
  sendOtp,
  registerController,
  loginController,
  forgotPasswordController,
  updateProfileController,
};
