const {
  withdrawalModel,
  transactionModel,
} = require("../models/transactionModel");
const userModel = require("../models/userModel.js");

const sendWithdrawReq = async (req, res) => {
  try {
    const { email, upi_id, bank_name, ifsc, cardInfo, amount } = req.body;
    if (!email || (!upi_id && !cardInfo) || !amount) {
      res.status(500).json({
        message: "Please enter your payment info ",
        status: false,
      });
    }

    const user = await userModel.findOne({ email });

    if (user.money < amount) {
      res.status(500).json({
        success: false,
        message: "Did n't have Enogth balance",
      });
    }

    await userModel.updateOne(
      { _id: user._id },
      {
        $set: {
          money: user.money - amount,
        },
      }
    );

    const model = withdrawalModel({
      userId: user._id,
      upi_id,
      bank_name,
      ifsc,
      cardInfo,
      amount,
    });

    const result = await model.save();

    res.status(201).json({
      message: "Success",
      status: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in sendWithdrawReq",
      error: err,
    });
  }
};

const getAllWithDrawReqs = async (req, res) => {
  try {
    const data = await withdrawalModel.find({
      status: "pending",
    });
    res.status(201).json({
      message: "Success",
      status: true,
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in getAllWithDrawReqs",
      error: err,
    });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { status, id } = req.body;
    await withdrawalModel.updateOne(
      { _id: id },
      {
        $set: {
          status,
        },
      }
    );
    res.status(200).json({
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in changeStatus",
      error,
    });
  }
};

const sendTransactionReq = async (req, res) => {
  try {
    const { email, amount, transaction_id, product_name } = req.body;

    if (!email || !transaction_id || !product_name || !amount) {
      res.status(500).json({
        message: "Please enter your payment info",
        status: false,
      });
    }
    const user = await userModel.findOne({ email });

    await userModel.updateOne(
      { _id: user._id },
      {
        $set: {
          money: user.money + amount,
        },
      }
    );

    const model = transactionModel({
      userId: user._id,
      amount,
      transaction_id,
      product_name,
    });
    const result = await model.save();

    res.status(201).json({
      message: "Success",
      status: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in sendTransactionReq",
      error: err,
    });
  }
};

const getTransactionReqs = async (req, res) => {
  try {
    const data = await transactionModel.find();
    res.status(201).json({
      message: "Success",
      status: true,
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in getTransactionReqs",
      error: err,
    });
  }
};

const redeamBalance = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    const data = await transactionModel.find({
      userId: user._id,
    });
    console.log(data);
    const todaysBonus = 0;
    for (let i = 0; i < data.length; i++) {
      //TODO: need to get the accual days bouns from product
      todaysBonus += 10;
    }
    const result = userModel.updateOne({
      _id: user._id,
    }, {
      money: user.money + todaysBonus,
    });
    
    res.status(201).json({
      message: "Success",
      status: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in redeamBalance",
      error: err,
    });
  }
};

const addMoneyTowalit = async (req, res) => {
  try {
    const { email, amount } = req.body;
    const user = await userModel.findOne({ email });
    const result = userModel.updateOne(
      {
        _id: user._id,
      },
      {
        amount: user.money + amount,
      }
    );
    res.status(201).json({
      message: "Success",
      status: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in addMoneyTowalit",
      error: err,
    });
  }
};

module.exports = {
  sendWithdrawReq,
  getAllWithDrawReqs,
  changeStatus,
  sendTransactionReq,
  getTransactionReqs,
  redeamBalance,
  addMoneyTowalit,
};
