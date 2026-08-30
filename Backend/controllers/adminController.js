import tryCatchHanler from "../middleware/tryCatchErrorHandler.js";
import doctorModel from "../models/doctorModel.js";
import ErrorHandler from "../utill/errorHanlder.js";
import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
const addDoctor = tryCatchHanler(async (req, res, next) => {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const image = req.file;

    // 1. Validations
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !image) {
        return next(new ErrorHandler('Write complete data', 400));
    }
    if (!validator.isEmail(email.trim())) {
        return next(new ErrorHandler('Enter a Valid Email', 400));
    }
    if (password.trim().length < 8) {
        return next(new ErrorHandler("Enter a strong password", 400));
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);

    // 3. Directly upload Buffer to Cloudinary via upload_stream
    const imageUpload = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "doctors",
                resource_type: "image"
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(image.buffer);
    });

    // 4. Save Record to Database
    const newDoctor = await doctorModel.create({
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        speciality: speciality.trim(),
        degree: degree.trim(),
        experience: experience.trim(),
        about: about.trim(),
        fees: Number(fees),
        address: typeof address === 'string' ? JSON.parse(address) : address,
        image: imageUpload.secure_url,
        date: Date.now()
    });

    res.status(201).json({
        success: true,
        message: "Doctor added successfully",
        doctor: newDoctor
    });
});


// Login Admin 

const loginAdmin = tryCatchHanler(
    async (req, res, next) => {
        const { email, password } = req.body;
        if (email != process.env.ADMIN_EMAIL || password != process.env.ADMIN_PASSWORD) {
            return next(new ErrorHandler("Invalid Crediential", 401))
        }
        const token = jwt.sign(email + password, process.env.JWT_SECRET)
        res.status(200).json({
            success: true,
            token: token
        })
    }
)

// Get All doctors 


const getAllDoctors = tryCatchHanler(
    async (req, res, next) => {
        const allDoctors = await doctorModel.find().select('-password');

        res.status(200).json({
            success: true,
            allDoctors
        })
    }
)


// Api to get AllAppoinment List
const AllAppointments = tryCatchHanler(
    async (req, res, next) => {
        const AppointmentList = await appointmentModel.find();
        res.status(200).json({
            success: true,
            AppointmentList
        })
    }
)


const cancelAppointmentAdmin = tryCatchHanler(
    async (req, res, next) => {
        const { appointmentId } = req.body;

        // 1. Fetch appointment data
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return next(new ErrorHandler("Appointment not found", 404));
        }

        // 2. Mark appointment status as cancelled
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // 3. Release doctor's booked slot
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        if (doctorData) {
            let slots_booked = doctorData.slotes_bookes;

            if (slots_booked && slots_booked[slotDate]) {
                // Remove the specific slotTime from the date array
                slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

                // Update Doctor document in Database
                await doctorModel.findByIdAndUpdate(docId, { slotes_bookes: slots_booked });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Appointment Cancelled Successfully"
        });
    }
);
export { addDoctor, loginAdmin, getAllDoctors, AllAppointments , cancelAppointmentAdmin};