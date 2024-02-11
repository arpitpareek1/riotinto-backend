
const express = require('express');
const { getAllInfoUser, getRefferForUser, getAllData } = require('../controllers/userController.js');
const { insertProducts, updatedProduct, getAllProductsData } = require("../controllers/productsController.js")
const {
    insertNews,
    getAllNews,
    updateNews
} = require("../controllers/newsController.js")
const router = express.Router();
router.post('/userData', getAllInfoUser);
router.get("/getAllData", getAllData)
router.post('/getRefferForUser', getRefferForUser);
router.post('/updatedProduct', updatedProduct);
router.post('/insertProducts', insertProducts);
router.post('/insertNews', insertNews);
router.post('/updateNews', updateNews);
router.get('/getAllProduct', getAllProductsData)
router.get('/getAllNewsData', getAllNews)
module.exports = router;
