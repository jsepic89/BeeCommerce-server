import express from "express";
import { checkToken, checkAdmin, checkTokenOrAdmin } from "./middleware/authMiddleware.js";
import bcrypt from 'bcrypt';
import User from "../models/User.js";

const router = express.Router();


//Get all users, previously checking if it's an admin
router.get('/', checkAdmin, async (req, res) => {
    try {
        const users = await User.find(req.params.id).select("-password");
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
});

//Get a single user, previously checking if it's an admin
router.get('/:id', checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
});

//Update a user, previously checking if it's the user itself
router.put('/:id', checkToken, async (req, res) => {
    let password = req.body.password
    if(password){
        password = await bcrypt.hash(password, 10);
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true});

        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json(error)
    }
});


//Delete a user, previously checking if it's the user itself, or an admin
router.delete('/:id', checkTokenOrAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted")
    } catch (error) {
        res.status(500).json(error)
    }
});


export default router;