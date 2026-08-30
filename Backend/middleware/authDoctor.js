import jwt from "jsonwebtoken";
import tryCatchHanler from "./tryCatchErrorHandler.js";
import ErrorHandler from "../utill/errorHanlder.js";

// user authentication 
const authDoctor = tryCatchHanler(
    async (req, res, next) => {
        const { doctortoken } = req.headers;
        
        if (!doctortoken) {
            return next(new ErrorHandler('Not an authorized user', 401));
        }

        const tokenDecode = jwt.verify(doctortoken, process.env.JWT_SECRET);
        
        // Fix: Direct req object par userId set karein (req.body par nahi)
        req.doctorId = tokenDecode.id || tokenDecode.userId; 
        
        next();
    }
);

export default authDoctor;