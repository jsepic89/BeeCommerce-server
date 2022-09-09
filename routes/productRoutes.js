import express from "express";
import { checkAdmin } from "./middleware/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

// Create
router.post('/', checkAdmin, async (req, res) => {
    try {
        const product = new Product(req.body)
        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update
router.put('/:id', checkAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true});

        res.status(200).json(updatedProduct);

    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete
router.delete('/:id', checkAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json("Product deleted");

    } catch (error) {
        res.status(500).json(error);
    }
});


//Get all products, or sort by category
router.get('/', async (req, res) => {
    const categoryQuery = req.query.category;
    let products;
    try {
        if (categoryQuery){
            products = await Product.find({category : { $in: categoryQuery}})
        } else {
            products = await Product.find();
        }
        
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json(error);
    }
});

//Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
});


export default router;