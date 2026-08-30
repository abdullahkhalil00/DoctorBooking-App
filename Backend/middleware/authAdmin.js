import jwt from "jsonwebtoken";
import tryCatchHanler from "./tryCatchErrorHandler.js";
import ErrorHandler from "../utill/errorHanlder.js";

// admin authentication 
const authAdmin = tryCatchHanler(
    async (req, res, next) => {
        const { admintoken } = req.headers;
        
        // Return add karna zaroori hai taake code aage run na ho
        if (!admintoken) {
            return next(new ErrorHandler('Not a authorized user', 401)) 
        }

        const tokenDecode = jwt.verify(admintoken, process.env.JWT_SECRET)
        
        if (tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return next(new ErrorHandler("Invalid Crediential", 401))
        }
        
        next()
    }
)

export default authAdmin