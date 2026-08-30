import tryCatchHanler from "../middleware/tryCatchErrorHandler.js";
import doctorModel from "../models/doctorModel.js";
import ErrorHandler from "../utill/errorHanlder.js";
import appointmentModel from '../models/appointmentModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// 1. Toggle Availability State
const changeAvailbility = tryCatchHanler(
    async (req, res, next) => {
        const { docId } = req.body;

        const docData = await doctorModel.findById(docId);

        if (!docData) {
            return next(new ErrorHandler("Doctor not found", 404));
        }

        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });

        res.status(200).json({
            success: true,
            message: 'Availability has changed'
        });
    }
);

// 2. Get All Doctors List (For Users/Public)
const getAllDoctorsList = tryCatchHanler(
    async (req, res, next) => {
        const allDoctors = await doctorModel.find().select(['-password', '-email']);

        res.status(200).json({
            success: true,
            allDoctors
        })
    }
)

// 3. Doctor Login
const doctorLogin = tryCatchHanler(
    async (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Please enter Email And Password", 400));
        }

        const data = await doctorModel.findOne({ email });
        if (!data) {
            return next(new ErrorHandler("Invalid credentials", 404));
        }

        const isMatched = await bcrypt.compare(password, data.password);
        if (isMatched) {
            const doctortoken = jwt.sign({ id: data._id }, process.env.JWT_SECRET);
            res.status(200).json({
                success: true,
                doctortoken
            })
        } else {
            return next(new ErrorHandler("Invalid credentials", 400));
        }
    }
)

// 4. Get All Appointments for Specific Doctor
export const getAllappointment = tryCatchHanler(async (req, res, next) => {
    const doctorId = req.doctorId;

    const appointments = await appointmentModel.find({ docId: doctorId });

    if (!appointments) {
        return next(new ErrorHandler("No Appointment Found", 404));
    }

    return res.status(200).json({
        success: true,
        AppointmentList: appointments
    });
});

// 5. NEW: Get Logged-In Doctor Profile Details
const getDoctorProfile = tryCatchHanler(
    async (req, res, next) => {
        const doctorId = req.doctorId;

        // Password secure rakhte hue doctor ka saara profile data fetch karna
        const profileData = await doctorModel.findById(doctorId).select('-password');

        if (!profileData) {
            return next(new ErrorHandler("Doctor Profile Not Found", 404));
        }

        res.status(200).json({
            success: true,
            profileData
        });
    }
);

// 6. NEW: Update Doctor Profile Details
const updateDoctorProfile = tryCatchHanler(
    async (req, res, next) => {
        const doctorId = req.doctorId;
        const { fees, address, available, about } = req.body;

        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            { fees, address, available, about },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedDoctor) {
            return next(new ErrorHandler("Failed to update profile", 400));
        }

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            profileData: updatedDoctor
        });
    }
);

export {
    changeAvailbility,
    getAllDoctorsList,
    doctorLogin,
    getDoctorProfile,
    updateDoctorProfile
};