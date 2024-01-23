const Product = require("../models/productModel.js");
const {
  withdrawalModel,
  transactionModel,
} = require("../models/transactionModel.js");

const userModel = require("../models/userModel.js");

const sendWithdrawReq = async (req, res) => {
  try {
    const { email, upi_id, bank_name, ifsc, cardInfo, amount } = req.body;
    if (!email || (!upi_id && !cardInfo) || !amount) {
      return res.status(200).json({
        message: "Please enter your payment info ",
        status: false,
      });
    }

    const user = await userModel.findOne({ email });
    if (user.money < amount) {
      return res.status(200).json({
        success: false,
        message: "Didn't have Enough balance",
      });
    }
    console.log("user", user);

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

    return res.status(201).json({
      message: "Success",
      status: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
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
      return;
    }

    const user = await userModel.findOne({ email });

    if (user && user.money < amount) {
      res.status(201).json({
        message: "Your balance is less then the price.",
        status: false,
      });
      return;
    }

    let value = Number(user.money) - Number(amount);

    const upDatedUser = await userModel.updateOne(
      {
        _id: user._id,
      },
      {
        money: value,
      }
    );

    const model = await transactionModel({
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
      upDatedUser
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

const checkIfOrderValidityEnds = (transactionDate, validity) => {
  if (!transactionDate || !validity) {
    return true;
  } else {
    const timeDifference = Date.now() - parseInt(user.lastRedeem);
    return timeDifference < validity * 24 * 60 * 60 * 1000
  }
}

const redeemBalance = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    console.log(user);
    if (user && user.lastRedeem) {
      const timeDifference = Date.now() - parseInt(user.lastRedeem);
      console.log("timeDifference", timeDifference);
      if (timeDifference < 24 * 60 * 60 * 1000) {
        res.status(201).json({
          message: "You have already redeem the points in 24 hours. please try after some time.",
          status: false,
        });
        return
      }
    }

    const data = await transactionModel.find({
      userId: user._id,
    });

    let todaysBonus = 0;
    const products = await Product.find();
    console.log(products);
    for (let i = 0; i < data.length; i++) {
      const traProduct = products.filter((product) => product.title === data[i].product_name)
      if (traProduct.length) {
        todaysBonus += Number(traProduct[0].dailyIncome);
      }
    }
    const result = await userModel.updateOne({
      _id: user._id,
    }, {
      money: user.money + todaysBonus,
      lastRedeem: Date.now()
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

const addMoneyToWallet = async (req, res) => {
  try {
    const { email, amount, transaction_id } = req.body;
    const user = await userModel.findOne({ email });
    console.log("user.money", user.money, amount);
    const toAdd = Number(user.money) + Number(amount)

    const model = await transactionModel({
      userId: user._id,
      amount,
      transaction_id: transaction_id ? transaction_id : "jhgflksdjlfaksdjbldksj",
      product_name: "ADDED_TO_WALLET",
    });

    const result = await userModel.updateOne(
      {
        _id: user._id,
      },
      {
        money: toAdd,
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
      message: "Error in addMoneyToWallet",
      error: err,
    });
  }
};

const getTransactionForUser = async (req, res) => {
  try {
    const { email } = req.body
    const user = await userModel.findOne({
      email
    });
    console.log("user._id", user._id);

    if (user && user._id) {
      const data = await transactionModel.find({
        userId: user._id
      })
      console.log("data", data);
      if (data) {
        res.status(200).send({
          success: true,
          message: "Succsess",
          data,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Succsess",
          data: [],
        });
      }
    } else {
      res.status(200).send({
        success: false,
        message: "Error in getTransactionForUser",
        // error: error,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getTransactionForUser",
      error: error,
    });
  }
}
module.exports = {
  sendWithdrawReq,
  getAllWithDrawReqs,
  changeStatus,
  sendTransactionReq,
  getTransactionReqs,
  redeemBalance,
  addMoneyToWallet,
  getTransactionForUser
};
