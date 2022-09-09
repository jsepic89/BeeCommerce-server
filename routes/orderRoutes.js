import express from "express";
import { checkAdmin, checkToken, checkTokenOrAdmin } from "./middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

// Create
router.post('/', checkToken, async (req, res) => {
    try {
        const order = new Order(req.body)
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update
router.put('/:id', checkAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true});

        res.status(200).json(updatedOrder);

    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete
router.delete('/:id', checkTokenOrAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json("Order deleted");

    } catch (error) {
        res.status(500).json(error);
    }
});


//Get all orders
router.get('/', checkAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
        
        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json(error);
    }
});

//Get single order
router.get('/:userId', checkTokenOrAdmin, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json(error)
    }
});


export default router;