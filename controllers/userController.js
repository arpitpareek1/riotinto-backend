const userModel = require("../models/userModel.js");

const {
    withdrawalModel,
    transactionModel,
} = require("../models/transactionModel.js");

const getAllInfoUser = async (req, res) => {
    try {
        const { email } = req.body;

        const userInfo = await userModel.findOne({ email });
        if (userInfo && userInfo._id) {
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
        } else {
            res.status(200).json({
                status: true,
                data: {
                    userInfo
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in getAllInfoUser",
            error: err,
        });
    }
};

const getRefferForUser = async (req, res) => {
    try {
        const { email } = req.body
        const userInfo = await userModel.findOne({ email: email });
        console.log("userInfo", userInfo.referralCode);
        const allRefferdUsers = await userModel.find({
            referredBy: userInfo._id
        })
        console.log("allRefferdUsers", allRefferdUsers);
        res.status(200).json({
            status: true,
            data: allRefferdUsers
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error in getRefferForUser",
            error: err,
        });
    }

}

module.exports = {
    getAllInfoUser,
    getRefferForUser
};