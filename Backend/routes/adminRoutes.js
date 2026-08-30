import express from 'express'

import { addDoctor, AllAppointments, getAllDoctors, loginAdmin } from '../controllers/adminController.js'
import upload from '../middleware/multer.js'
import authAdmin from '../middleware/authAdmin.js'
import { changeAvailbility } from '../controllers/doctorController.js'
import { cancelAppointmentAdmin } from '../controllers/adminController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor' ,authAdmin ,upload.single('image') , addDoctor)
adminRouter.get('/all-doctors' , authAdmin , getAllDoctors)
adminRouter.post('/login' , loginAdmin)
adminRouter.post('/change-availability' , authAdmin , changeAvailbility)
adminRouter.get('/appointment-list' , authAdmin , AllAppointments)
adminRouter.put('/cancel-appointment' , authAdmin , cancelAppointmentAdmin)
export default adminRouter

