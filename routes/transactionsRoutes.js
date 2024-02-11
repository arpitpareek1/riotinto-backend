
const express = require('express');
const {
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
} = require('../controllers/transactionsController');
const router = express.Router();
router.post("/sendWithdrawReq", sendWithdrawReq);
router.get("/getAllWithDrawReqs", getAllWithDrawReqs);
router.post("/getWithDrawReqs", getWithDrawReqs);
router.post("/changeStatus", changeStatus);
router.get("/getTransactionReqs", getTransactionReqs);
router.post("/sendTransactionReq", sendTransactionReq);
router.post("/canUserBuyProduct", canUserBuyProduct);
router.post("/addMoneyToWallet", addMoneyToWallet)
router.post("/redeemBalance", redeemBalance)
router.post("/getTransactionForUser", getTransactionForUser)
router.post("/buyMoreChances", buyMoreChances)
module.exports = router;
