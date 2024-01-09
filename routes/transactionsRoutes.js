
const express = require('express');
const { sendWithdrawReq,
    getAllWithDrawReqs,
    changeStatus,
    sendTransactionReq,
    getTransactionReqs
} = require('../controllers/trasncantionsController');

// //router object
const router = express.Router();
//withdraw
router.post("/sendWithdrawReq", sendWithdrawReq);
router.get("/getAllWithDrawReqs", getAllWithDrawReqs);
router.post("/changeStatus", changeStatus);

//transactions
router.get("/getTransactionReqs", getTransactionReqs);
router.post("/sendTransactionReq", sendTransactionReq);

module.exports = router;
