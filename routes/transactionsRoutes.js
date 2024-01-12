
const express = require('express');
const {
    sendWithdrawReq,
    getAllWithDrawReqs,
    changeStatus,
    sendTransactionReq,
    getTransactionReqs,
    redeemBalance,
    addMoneyToWallet
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

module.exports = router;
