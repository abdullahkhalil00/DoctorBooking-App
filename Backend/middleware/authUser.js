import jwt from "jsonwebtoken";
import tryCatchHanler from "./tryCatchErrorHandler.js";
import ErrorHandler from "../utill/errorHanlder.js";

// user authentication 
const authUser = tryCatchHanler(
    async (req, res, next) => {
        const { usertoken } = req.headers;
        
        if (!usertoken) {
            return next(new ErrorHandler('Not an authorized user', 401));
        }

        const tokenDecode = jwt.verify(usertoken, process.env.JWT_SECRET);
        
        // Fix: Direct req object par userId set karein (req.body par nahi)
        req.userId = tokenDecode.id || tokenDecode.userId; 
        
        next();
    }
);

export default authUser;