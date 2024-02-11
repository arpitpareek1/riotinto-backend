const userModel = require("../models/userModel.js");
const shortid = require("shortid");
const { hashPassword, generateOTP } = require("../helpers/authHelper.js");
const JWT = require("jsonwebtoken");
const sdk = require('api')('@telesign-enterprise/v1.0#55lb030lqba2f1f');

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
    }

    const newUser = new userModel({
      name,
      email,
      password: password,
      phone,
      address,
      money: 0,
      referredBy: referredByUser ? referredByUser._id : null,
      referralCode: shortid.generate(),
      rechargePoints: 0,
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

const createErrorResponse = (res, status, message) => {
  return res.status(status).json({ error: message });
};

const updateUserController = async (req, res) => {
  try {
    const { _id, name, email, password, phone, address, money, rechargePoints, referralCode } = req.body;
    if (!_id) {
      return createErrorResponse(res, 200, "User ID is required");
    }

    const userInfo = await userModel.findById(_id);
    if (!userInfo) {
      return createErrorResponse(res, 200, "User not found");
    }
    console.log(req.body);
    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!email) missingFields.push("Email");
    if (!password) missingFields.push("Password");
    if (!phone) missingFields.push("Phone");
    if (!address) missingFields.push("Address");
    if (money === undefined || money < 0) missingFields.push("Balance");
    if (rechargePoints === undefined || rechargePoints < 0) missingFields.push("Deposit Points");

    if (missingFields.length > 0) {
      const errorMessage = `The following fields are required: ${missingFields.join(", ")}`;
      return createErrorResponse(res, 200, errorMessage);
    }
    let user = {};
    user.name = name;
    user.email = email;
    user.password = password;
    user.phone = phone;
    user.address = address;
    user.money = Number(money);
    user.referralCode = referralCode;
    user.rechargePoints = Number(rechargePoints)
    user.isNew = false;

    console.log(user);
    const updatedUser = await userModel.updateOne(
      { _id: _id },
      {
        $set: { ...user }
      });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return createErrorResponse(res, 200, "Something went wrong while updating user");
  }
};

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
    const otp = generateOTP();
    sdk.auth('C1C7CFC7-2B36-46D6-B841-AEDD859E1E50', 'eKEHCozjEtsV49WdkQ3dbGPZH5Sx2PKz50iEUx85xikGvZ5W93DhxJIeg7RlO38YUgyGt9nkynA2HvWmDOVdQQ==');
    sdk.sendSMSVerifyCode({ is_primary: 'true', phone_number: '91' + phoneNumber, verify_code: otp })
      .then(({ data }) => {
        res.json({ status: true, data, otp });
      })
      .catch(err => res.json({ status: false, error: err }));
  } catch (error) {
    res.json({ status: false, error: error.message });
  }
};

module.exports = {
  sendOtp,
  registerController,
  loginController,
  forgotPasswordController,
  updateProfileController,
  updateUserController
};
