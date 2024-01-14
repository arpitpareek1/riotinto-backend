
const express = require('express');
const {
    sendWithdrawReq,
    getAllWithDrawReqs,
    changeStatus,
    sendTransactionReq,
    getTransactionReqs,
    redeemBalance,
    addMoneyToWallet,
    getTransactionForUser
} = require('../controllers/transactionsController');

// //router object
const router = express.Router();

//withdraw
router.post("/sendWithdrawReq", sendWithdrawReq);
router.get("/getAllWithDrawReqs", getAllWithDrawReqs);
router.post("/changeStatus", changeStatus);

//transactions
router.get("/getTransactionReqs", getTransactionReqs);
router.post("/sendTransactionReq", sendTransactionReq);

//user wallet
router.post("/addMoneyToWallet", addMoneyToWallet)
router.post("/redeemBalance", redeemBalance)
router.post("/getTransactionForUser", getTransactionForUser)

module.exports = router;
