import express from "express";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        email,
        password: hashedPassword
    });

    try {
        const newUser = await user.save();
        res.status(200).json(newUser)
    } catch (error) {
        res.status(500).json(error)
    }
});


/*  login will check if the email exists in the database, and if the password is correct via bcrypt.compare
 if credentials are OK, a jsonwebtoken for 30 days is generated. */
router.post('/login', async (req, res) => {
    const { email, password } = await req.body;
    try {
        const user = await User.findOne({ email });
        
        if (!user){
            let error = new Error("The user doesn't exist");
            return res.status(401).json({ message: error.message});
        }
    
        const correctPassword = await bcrypt.compare(password, user.password);
    
        if (!correctPassword){
            let error = new Error("Invalid username or password");
            return res.status(401).json({ message: error.message});
        }
    
        const token = jwt.sign({
            username: user.name,
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_KEY, { expiresIn: "30d" });
    
     // I have to manually select what I want to be returned, otherwise the password will be included in the json
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token
        });

    } catch (error) {
        res.status(500).json(error);
    }
});

//TO COMPLETE
router.post('/logout', async (req, res) => {

});

export default router;