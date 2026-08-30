import express from "express";
import { doctorLogin, getAllDoctorsList , getAllappointment, getDoctorProfile, updateDoctorProfile } from "../controllers/doctorController.js";
import authDoctor from "../middleware/authDoctor.js";
const doctorRouter = express.Router()



doctorRouter.get('/list' , getAllDoctorsList)
doctorRouter.post('/login' , doctorLogin)
doctorRouter.get('/appointments' , authDoctor , getAllappointment)
doctorRouter.get('/doctor-profile' , authDoctor , getDoctorProfile)
doctorRouter.put('/change-profile' , authDoctor , updateDoctorProfile)

export default doctorRouter