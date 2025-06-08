const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/userModel");


const isVerifiedUser = async (req, res, next) => {
    try{

        const { accessToken } = req.cookies;
        
        if(!accessToken){
            const error = createHttpError(401, "Please provide token!");
            return next(error);
        }

        const decodeToken = jwt.verify(accessToken, config.accessTokenSecret);

        const user = await User.findById(decodeToken._id);
        if(!user){
            const error = createHttpError(401, "User not exist!");
            return next(error);
        }

        req.user = user;
        next();

    }catch (error) {
        const err = createHttpError(401, "Invalid Token!");
        next(err);
    }
}

// Middleware to check if user has Admin role
const isAdmin = async (req, res, next) => {
    try {
        if (req.user && req.user.role === "Admin") {
            next();
        } else {
            const error = createHttpError(403, "Access denied. Admin role required.");
            return next(error);
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { isVerifiedUser, isAdmin };