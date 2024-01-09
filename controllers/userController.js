const userModel = require("../models/userModel.js");

const {
    withdrawalModel,
    transactionModel,
} = require("../models/transactionModel.js");

const getAllInfoUser = async (req, res) => {
    try {
        const { email } = req.body;
        const userInfo = await userModel.findOne({ email: email });
        const transactionsInfo = await transactionModel.find({
            userId: userInfo._id,
        });
        const withdrawalInfo = await withdrawalModel.find({
            userId: userInfo._id,
        });
        res.status(200).json({
            status: true,
            data: {
                userInfo,
                transactionsInfo,
                withdrawalInfo
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in getAllInfoUser",
            error: err,
        });
    }
};

module.exports = {
    getAllInfoUser
};