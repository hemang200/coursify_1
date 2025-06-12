import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
    const { token } = req.cookies;
    console.log("Token in cookies:", token);
    if (!token) {
        return next(new AppError("Unauthenticated, please login again", 401));
    }
    
   const userDetails = jwt.verify(token, process.env.JWT_SECRET);

    
    req.user = userDetails;
    console.log("User details from token:", userDetails);
    next();
}

const authorizedRoles = (...roles) => async (req, res, next) => {
    console.log("Checking role:", req.user.role);
    const currentUserRole = req.user.role;
    if (!roles.includes(req.user.role)) {
        return next(new AppError(`Role: ${req.user.role} is not allowed to access this resource`, 403));
    }
    next();
}

const authorizeSubscriber = async (req, res, next) => {
    const subscription = req.user.subscription;
    const currentUserRole = req.user.role;
    if (currentUserRole !== 'admin' && (!subscription || subscription.status !== 'active')) {
        return next(new AppError("Please subscribe to access this route", 403));
    }
}

export {isLoggedIn, authorizedRoles, authorizeSubscriber}