import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

/* token is delivered in req.headers.authorization, starting with the word Bearer and a space
we first check if there is a token, if true, we decode it to gather the user information and 
execute the next controller using next() */
const checkToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.startsWith("Bearer") ? 
            req.headers.authorization.split(" ")[1] : null;

        const decodedToken = jwt.verify(token, process.env.JWT_KEY);

        req.user = await User.findOne({ _id: decodedToken.id }).select("-password");
        next();
    } catch (error) {
        return res.status(404).json({error});
    };
};

const checkTokenOrAdmin = (req, res, next) => {
    checkToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else {
            res.status(500).json("Access denied");
        }
    });
};

const checkAdmin = (req, res, next) => {
    checkToken(req, res, () => {
        if (req.user.isAdmin){
            next();
        } else {
            res.status(500).json("Access denied");
        }
    });
};


export { checkToken, checkTokenOrAdmin, checkAdmin };