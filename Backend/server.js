import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectionToMongoDB from './config/mongoDB.js'
import connectToCloudinary from './config/clodniary.js'
import adminRouter from './routes/adminRoutes.js'
import errorMiddleWare from './middleware/error.js'
import doctorRouter from './routes/doctorRoutes.js'
import userRouter from './routes/userRputes.js'
// app Config 
const app = express()
const PORT = process.env.PORT
connectionToMongoDB()
connectToCloudinary()
// middleWare 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

// routes
app.get('/' , (req,res) =>{
    res.send("Api is working")
})
app.use('/api/admin' , adminRouter)
app.use('/api/doctor' , doctorRouter)
app.use('/api/user' , userRouter)





app.use(errorMiddleWare)

app.listen(PORT , () => console.log(`Server is working at http://localhost:${PORT}`)) 