import express from 'express'
import { registerUser , loginUser, userDetail, UpdateUserDetail, bookAppointment, getSingleUserAppointment, cancelAppointment, payOnline } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.post('/register' , registerUser)
userRouter.post('/login' , loginUser)
userRouter.get('/userDetail' , authUser , userDetail)
userRouter.put('/updateProfile' , authUser , upload.single('image') , UpdateUserDetail)
userRouter.post('/book-appointment' , authUser , bookAppointment)
userRouter.get('/my-appointment' , authUser , getSingleUserAppointment)
userRouter.put('/cancel-appointment' , authUser , cancelAppointment);
userRouter.put('/pay-appointment' , authUser , payOnline);

// userRouter.get('/userDetail/:id' ,  userDetail)


export default userRouter