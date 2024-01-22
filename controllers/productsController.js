
const Product = require("../models/productModel")

function validateProductData(productData) {
    const errors = [];

    if (!productData.imageSource || !productData.link || !productData.price || !productData.title ||
        !productData.dailyIncome || !productData.validity || !productData.purchaseLimit || !productData.desc) {
        errors.push('All fields are required');
    }

    if (typeof productData.imageSource !== 'string' || typeof productData.link !== 'string' ||
        typeof productData.title !== 'string' || typeof productData.desc !== 'string') {
        errors.push('Invalid data types for string fields');
    }

    if (isNaN(Number(productData.price)) || isNaN(Number(productData.dailyIncome)) ||
        isNaN(Number(productData.validity)) || isNaN(Number(productData.purchaseLimit))) {
        errors.push('Invalid data types for numeric fields');
    }

    return errors;
}

const insertProducts = async (req, res) => {
    const validationErrors = validateProductData(req.body);

    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    try {
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
    }
}


const updatedProduct = async (req, res) => {
    const { productId } = req.body;
    const validationErrors = validateProductData(req.body);

    if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });

        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
}

const getAllProductsData = async (req, res) => {
    try {
        res.status(200).json(await Product.find());
    } catch (error) {
        res.status(500).json(error)
    }

}

module.exports = {
    insertProducts,
    updatedProduct,
    getAllProductsData
}