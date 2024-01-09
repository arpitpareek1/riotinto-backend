const { withdrawalModel, transactionModel } = require('../models/transactionModel');

const sendWithdrawReq = async (req, res) => {
    try {
        const {
            userId,
            upi_id,
            bank_name,
            ifsc,
            cardInfo,
            amount
        } = req.body;
        if (!userId || (!upi_id && !cardInfo) || !amount) {
            res.status(500).json({
                message: "Please enter your payment info ",
                status: false
            });
        }
        const model = (withdrawalModel({
            userId,
            upi_id,
            bank_name,
            ifsc,
            cardInfo,
            amount
        }));
        const result = await model.save();
        res.status(201).json({
            message: "Success",
            status: true,
            data: result
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
            status: "pending"
        });
        res.status(201).json({
            message: "Success",
            status: true,
            data
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
                    status
                },
            });
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
        const {
            userId,
            amount,
            transaction_id,
            product_name
        } = req.body;
        if (!userId || !transaction_id || !product_name || !amount) {
            res.status(500).json({
                message: "Please enter your payment info",
                status: false
            });
        }
        const model = (transactionModel({
            userId,
            amount,
            transaction_id,
            product_name
        }));
        const result = await model.save();
        res.status(201).json({
            message: "Success",
            status: true,
            data: result
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
            data
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

module.exports = {
    sendWithdrawReq,
    getAllWithDrawReqs,
    changeStatus,
    sendTransactionReq,
    getTransactionReqs
}

