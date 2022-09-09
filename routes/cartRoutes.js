import express from "express";
import { checkAdmin, checkToken } from "./middleware/authMiddleware.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// Create
router.post('/', checkToken, async (req, res) => {
    try {
        const cart = new Cart(req.body)
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update
router.put('/:id', checkToken, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true});

        res.status(200).json(updatedCart);

    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete
router.delete('/:id', checkToken, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);

        res.status(200).json("Cart deleted");

    } catch (error) {
        res.status(500).json(error);
    }
});


//Get all carts
router.get('/', checkAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        
        res.status(200).json(carts);

    } catch (error) {
        res.status(500).json(error);
    }
});

//Get single cart
router.get('/:userId', checkToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json(error)
    }
});


export default router;