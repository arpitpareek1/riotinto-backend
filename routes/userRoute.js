
const express = require('express');
const { getAllInfoUser, getRefferForUser } = require('../controllers/userController.js');
const { productsData, newsData } = require('../helpers/authHelper.js');

// //router object
const router = express.Router();

router.post('/userData', getAllInfoUser);
router.post('/getRefferForUser', getRefferForUser);
router.get('/getAllProduct', (req, res) => res.json(productsData))
router.get('/getAllNewsData', (req, res) => res.json(newsData))
router.get('/getRefferForUser', (req, res) => res.json(newsData))

module.exports = router;
