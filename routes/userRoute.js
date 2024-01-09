
const express = require('express');
const { getAllInfoUser } = require('../controllers/userController.js');

// //router object
const router = express.Router();

router.get('/userData', getAllInfoUser);

module.exports = router;
