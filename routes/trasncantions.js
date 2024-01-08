
const express=require('express');


// //router object
const router = express.Router();

router.get("/sendWithdrawReq", sendWithdrawReq)
module.exports=router;
