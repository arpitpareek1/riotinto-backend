const userModel = require("../models/userModel.js");
const Product = require("../models/productModel.js");
const {
  withdrawalModel,
  transactionModel,
} = require("../models/transactionModel.js");
const Settings = require("../models/settings.js");


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

    const allUserWithdraws = await withdrawalModel.find({
      userId: user._id
    })

    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());

    let requestsThisWeek = 0;

    allUserWithdraws.forEach(request => {
      if (new Date(request.createdAt) >= startOfWeek) {
        requestsThisWeek++;
      }
    });

    if (requestsThisWeek > 3) {
      return res.status(200).json({
        success: false,
        message: "You have already requested more then 3 times. Please try next week!",
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
const getWithDrawReqs = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await userModel.findOne({
      email: email
    });
    console.log(user);
    if (!user) {
      return res.status(200).send({
        message: "user not found"
      });
    }

    const data = await withdrawalModel.find({
      userId: user._id
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

    if (status === "cancelled") {
      const transactionInfo = await withdrawalModel.findOne({
        _id: id
      });
      console.log("tra", transactionInfo);
      if (transactionInfo && transactionInfo.userId) {
        const userInfo = await userModel.findOne({ _id: transactionInfo.userId });
        console.log("user", userInfo);
        if (userInfo) {
          await userModel.updateOne(
            { _id: transactionInfo.userId },
            {
              $set: {
                money: Number(transactionInfo.amount) + Number(userInfo.money),
              },
            }
          );
        }
      }
    }

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
    const { email, amount, transaction_id, product_name, payment_mode } = req.body;
    console.log("req.body", req.body);
    if (!email || !transaction_id || !product_name || !amount) {
      res.status(500).json({
        message: "Please enter your payment info",
        status: false,
      });
      return;
    }

    const user = await userModel.findOne({ email });
    let upDatedUser = null;
    if (payment_mode && payment_mode === "Recharge" && Number((user.rechargePoints || 0)) >= Number(amount)) {
      upDatedUser = await userModel.updateOne(
        {
          _id: user._id,
        },
        {
          rechargePoints: Number((user.rechargePoints || 0)) - Number(amount),
        }
      );
    } else if (payment_mode && payment_mode === "Balance" && Number((user.money || 0)) >= Number(amount)) {
      upDatedUser = await userModel.updateOne(
        {
          _id: user._id,
        },
        {
          rechargePoints: Number((user.money || 0)) - Number(amount),
        }
      );
    } else {
      res.status(201).json({
        message: "Your balance is less then the price.",
        status: false,
      });
      return;
    }

    const model = await transactionModel({
      userId: user._id,
      amount,
      transaction_id,
      product_name,
      payment_method: "UPI"
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

function isPlanExpired(validityDays, startDate) {
  const currentDate = new Date();
  const planEndDate = new Date(startDate);
  planEndDate.setDate(planEndDate.getDate() + validityDays);
  console.log("iiiiiiiiiiiii", currentDate, planEndDate);
  return currentDate >= planEndDate;
}

async function removeExpiredProducts(id) {
  const allProducts = await Product.find();
  const allTransitions = await transactionModel.find({
    userId: id
  });
  if (allTransitions && allTransitions.length) {
    let toAddMoney = 0;
    for (let i = 0; i < allTransitions.length; i++) {
      const transaction = allTransitions[i];
      const product = allProducts.filter((product) => product.title === transaction.product_name);
      if (product.length && (transaction.status === "in_progress" || !transaction.status) && isPlanExpired(product[0].validity, transaction.createdAt)) {
        if (product[0].isHot) {
          toAddMoney += product[0].price;
        }
        const update = await transactionModel.updateOne(
          { _id: transaction._id },
          {
            $set: {
              status: "expired",
            },
          }
        );
      } else {
        console.log(product);
      }
    }
    console.log("toAddMoney", toAddMoney);
    if (toAddMoney) {
      const user = await userModel.findOne({
        _id: id
      });
      if (user) {
        await userModel.updateOne({
          _id: id
        }, {
          money: Number(user.money) + Number(toAddMoney)
        });
      }
    }
  }
}

const redeemBalance = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    console.log(user);
    if (user && user.lastRedeem) {
      await removeExpiredProducts(user._id);
      const timeDifference = Date.now() - parseInt(user.lastRedeem);
      console.log("timeDifference", timeDifference);
      if (timeDifference < 24 * 60 * 60 * 1000) {
        res.status(201).json({
          message: "You have already redeem the points in 24 hours. please try after some time.",
          status: false,
        });
        return;
      }
    }

    const data = await transactionModel.find({
      userId: user._id,
    });
    if (!data.filter((obj) => (!["ADDED_TO_WALLET", "LUCKY_SPIN_WIN", "GETTING_SPINNER_CHANCES"].includes(obj.product_name))).length) {
      res.status(201).json({
        message: "To Redeem need to buy at least one product.",
        status: false,
      });
      return;
    }

    let todaysBonus = 0;
    const products = await Product.find();
    console.log(products);
    for (let i = 0; i < data.length; i++) {
      const traProduct = products.filter((product) => !product.isHot && product.title === data[i].product_name);
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

const addReferAmount = async (userReferCode) => {

  console.log("userReferCode: ", userReferCode);
  const settings = await Settings.findOne({
    key: "refer_amount"
  });
  const settingForSecondRefer = await Settings.findOne({ key: "refer_second_time" });

  if (settings && settingForSecondRefer) {
    console.log("settings", settings);

    const user = await userModel.findOne({
      referralCode: userReferCode
    });
    console.log("user", user);
    if (user) {
      const referAmount = user.isRefered ? settingForSecondRefer.value : settings.value;
      console.log("user", user);
      await userModel.updateOne({
        _id: user._id
      }, {
        isRefered: true,
        rechargePoints: Number(user.rechargePoints || 0) + Number(referAmount)
      });

      const tra = {
        userId: user._id,
        amount: Number(referAmount),
        transaction_id: "165446494848674786",
        product_name: "REFER_TRANSACTION",
        payment_method: "UPI"
      };
      await transactionModel.insertMany(tra);
    }
  }
};

const addMoneyToWallet = async (req, res) => {
  try {
    const { email, amount, transaction_id, method } = req.body;
    const user = await userModel.findOne({ email });
    console.log("user.money", user.rechargePoints, amount);
    const toAdd = Number(user.rechargePoints ?? 0) + Number(amount);

    const model = await transactionModel.insertMany({
      userId: user._id,
      amount: Number(amount),
      transaction_id: transaction_id ? transaction_id : "165446494848674786",
      product_name: method === "LUCKY_SPIN_WIN" ? method : "ADDED_TO_WALLET",
      payment_method: "UPI"
    });

    if (!user.isReferAmountAdded && user.userReferCode && method === "RECHARGE") {
      await addReferAmount(user.userReferCode);
    }

    console.log("model", model);
    const settings = await Settings.findOne({
      key: "refer_amount"
    });
    if (method === "RECHARGE") {
      const result = await userModel.updateOne(
        {
          _id: user._id,
        },
        {
          rechargePoints: (!user.isReferAmountAdded && user.userReferCode && method === "RECHARGE") ? toAdd + Number(settings.value) : toAdd,
          isReferAmountAdded: true,
        }
      );
      res.status(201).json({
        message: "Success",
        status: true,
        data: result,
      });
    } else {
      const result = await userModel.updateOne(
        {
          _id: user._id,
        },
        {
          money: Number(user.money) + Number(amount)
        }
      );
      res.status(201).json({
        message: "Success",
        status: true,
        data: result,
      });
    }
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
    const { email } = req.body;
    const user = await userModel.findOne({
      email
    });
    console.log("user._id", user._id);

    if (user && user._id) {
      const data = await transactionModel.find({
        userId: user._id
      });
      console.log("data", data);
      if (data) {
        res.status(200).send({
          success: true,
          message: "Success",
          data,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Success",
          data: [],
        });
      }
    } else {
      res.status(200).send({
        success: false,
        message: "Error in getTransactionForUser",
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
};

const canUserBuyProduct = async (req, res) => {
  try {
    const { email, title } = req.body;
    const sendOk = () => {
      res.status(200).send({
        success: true,
        message: "Can buy this product"
      });
    };
    const user = await userModel.findOne({
      email
    });
    console.log("user._id", user._id);
    if (user && user._id && title) {
      const data = await transactionModel.find({
        userId: user._id,
        product_name: title
      });
      console.log("data", data);
      if (data && data.length > 0) {
        const product = await Product.find({
          title: title
        });
        console.log("product", product);
        if (product && product.length) {
          if (data.length >= Number(product[0].purchaseLimit)) {
            res.status(200).send({
              success: false,
              message: "You Cannot purchase this product as you have exceeded the limit for purchases"
            });
          } else {
            sendOk();
          }
        } else {
          console.log("Product not found");
        }
      } else {
        sendOk();
        console.log("No transaction data found");
      }
    } else {
      console.log("User not found or missing user ID or title");
    }
  } catch (e) {
    console.error("Error:", e);
  }

};

const buyMoreChances = async (req, res) => {

  try {
    const { method, email } = req.body;
    console.log(method, email);
    const user = await userModel.findOne({
      email
    });
    if (user) {
      if (method) {
        const settings = await Settings.findOne({
          key: "get_spinner_chances_in"
        });
        console.log("settings", settings);
        let result = null;
        if (method === "Recharge" && Number(user.rechargePoints) >= Number(settings.value ?? 100)) {
          result = await userModel.updateOne(
            {
              _id: user._id,
            },
            {
              rechargePoints: user.rechargePoints - Number(settings.value ?? 100)
            }
          );
          const transaction = {
            userId: user._id,
            amount: Number(settings.value ?? 100),
            product_name: "GETTING_SPINNER_CHANCES",
            transaction_id: new Date().getMilliseconds() + "5262462",
            payment_method: method
          };
          const tran = await transactionModel.insertMany(transaction);
        } else if (method === "Balance" && Number(user.money) >= Number(settings.value ?? 100)) {
          result = await userModel.updateOne(
            {
              _id: user._id,
            },
            {
              money: user.money - Number(settings.value ?? 100)
            }
          );
          const transaction = {
            userId: user._id,
            amount: Number(settings.value ?? 100),
            product_name: "GETTING_SPINNER_CHANCES",
            transaction_id: new Date().getMilliseconds() + "5262462",
            payment_method: method
          };
          const tran = await transactionModel.insertMany(transaction);
        } else if (method === "UPI") {
          const transaction = {
            userId: user._id,
            amount: Number(settings.value ?? 100),
            product_name: "GETTING_SPINNER_CHANCES",
            transaction_id: new Date().getMilliseconds() + "5262462",
            payment_method: method
          };
          const tran = await transactionModel.insertMany(transaction);
        } else {
          res.status(200).send({
            success: false,
            message: "Don't have enough money"
          });
          return;
        }
        console.log("result: ", result);
      }

    }
    res.status(200).send({
      success: true,
      message: "Success"
    });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      success: false,
      message: "Error in buyMoreChances",
      error: error,
    });
  }
};

module.exports = {
  sendWithdrawReq,
  getAllWithDrawReqs,
  changeStatus,
  sendTransactionReq,
  getTransactionReqs,
  redeemBalance,
  addMoneyToWallet,
  getTransactionForUser,
  canUserBuyProduct,
  getWithDrawReqs,
  buyMoreChances
};
