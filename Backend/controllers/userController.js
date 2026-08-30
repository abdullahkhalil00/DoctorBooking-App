import tryCatchHanler from "../middleware/tryCatchErrorHandler.js";
import ErrorHandler from "../utill/errorHanlder.js";
import userModel from "../models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken'
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

const registerUser = tryCatchHanler(
    async (req, res, next) => {
        const { name, email, password } = req.body;
        // 1. Validations
        if (!name || !email || !password) {
            return next(new ErrorHandler('Write complete data', 400));
        }
        if (!validator.isEmail(email.trim())) {
            return next(new ErrorHandler('Enter a Valid Email', 400));
        }
        if (password.trim().length < 8) {
            return next(new ErrorHandler("Enter a strong password", 400));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password.trim(), salt);

        const newUser = await userModel.create({
            name, email, password: hashedPassword
        })
        const userToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET)
        res.status(201).json({
            success: true,
            message: "user added successfully",

            userToken

        });
    }
)


const loginUser = tryCatchHanler(
    async (req, res, next) => {
        const { email, password } = req.body;
        const userFind = await userModel.findOne({ email })

        if (!userFind) {
            return next(new ErrorHandler("User Does Not Exist", 401))
        }
        const isMatched = await bcrypt.compare(password, userFind.password)
        if (!isMatched) {
            return next(new ErrorHandler("Invalid Crediential", 401))
        } else {

            const token = jwt.sign({ userId: userFind._id }, process.env.JWT_SECRET)
            res.status(200).json({
                success: true,
                token: token
            })
        }
    }
)


// Find user data 
const userDetail = tryCatchHanler(
    async (req, res, next) => {
        // const { id } = req.params;
        // const  data  = await userModel.findById(id).select('-password');

        const userid = req.userId;
        const data = await userModel.findById(userid).select('-password');
        if (!data) {
            return next(new ErrorHandler("No user found ", 401));
        }
        res.status(200).json({
            success: true,
            data
        })
    }
)


// Find user data 
// userController.js
const UpdateUserDetail = tryCatchHanler(
    async (req, res, next) => {
        const userId = req.userId;
        const { name, phone, address, gender, dob } = req.body;
        const imageFile = req.file;

        // Parse address if sent as JSON string via FormData
        let parsedAddress = address;
        if (typeof address === 'string') {
            try {
                parsedAddress = JSON.parse(address);
            } catch (err) {
                parsedAddress = address;
            }
        }

        const updateData = {
            ...(name && { name }),
            ...(phone && { phone }),
            ...(gender && { gender }),
            ...(dob && { dob }),
            ...(parsedAddress && { address: parsedAddress }),
        };

        // If a new image is uploaded, upload to Cloudinary
        if (imageFile) {
            const imageUpload = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "users",
                        resource_type: "image"
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(imageFile.buffer);
            });
            updateData.image = imageUpload.secure_url;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return next(new ErrorHandler("User not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    }
);

// Appointment book 

const bookAppointment = tryCatchHanler(
    async (req, res, next) => {
        const userId = req.userId;
        const { docID, slotDate, slotTime } = req.body; // Frontend se docID exact aa rha hai
        if (!slotDate || !slotTime) {
            return next(new ErrorHandler("Select date and time both", 400)); // return lagana zaroori hai
        }
        const docData = await doctorModel.findById(docID).select('-password');
        if (!docData) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        // 1. Check doctor availability (return add kiya taaki aage execute na ho)
        if (!docData.available) {
            return res.status(200).json({
                success: false, // Fix: false hona chahiye
                message: "Doctor is currently not available"
            });
        }

        let slot_booked = docData.slotes_bookes || {};

        // 2. Check for slot availability
        if (slot_booked[slotDate]) {
            if (slot_booked[slotDate].includes(slotTime)) {
                return res.status(200).json({
                    success: false, // Fix: false hona chahiye
                    message: "Slot is currently unavailable"
                });
            } else {
                slot_booked[slotDate].push(slotTime);
            }
        } else {
            slot_booked[slotDate] = [];
            slot_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select('-password');

        // 3. Document ko Plain JS Object banana taaki delete chal sake
        const doctorObj = docData.toObject();
        delete doctorObj.slotes_bookes;

        const appointmentData = {
            userId,
            docId: docID,
            userData,
            docData: doctorObj,
            amount: docData.fees,
            slotDate,
            slotTime,
            date: Date.now()
        };

        // 4. Save appointment (Fix: new Model().save() use kiya)
        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // 5. Update doctor slots
        await doctorModel.findByIdAndUpdate(docID, { slotes_bookes: slot_booked });

        res.status(200).json({
            success: true,
            message: "Appointment is booked"
        });
    }
);

//  Get All Appointment booked by a user 
const getSingleUserAppointment = tryCatchHanler(
    async (req, res, next) => {
        const userId = req.userId;

        // Direct variable assignment without destructuring
        const appointments = await appointmentModel.find({ userId });

        if (!appointments || appointments.length === 0) {
            return res.status(200).json({
                success: true,
                message: "You have no appointments booked yet",
                appointments: []
            });
        }

        res.status(200).json({
            success: true,
            appointments
        });
    }
);
const cancelAppointment = tryCatchHanler(
  async (req, res, next) => {
    const userId = req.userId;
    const { appointmentId } = req.body;

    // 1. Fetch appointment data
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // 2. Fix: Compare IDs after converting to String
    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized action"
      });
    }

    // 3. Mark appointment status as cancelled in appointment collection
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // 4. Release doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    if (doctorData) {
      let slots_booked = doctorData.slotes_bookes;

      if (slots_booked[slotDate]) {
        // Remove specific slotTime from the date array
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        // Update Doctor slots in Database
        await doctorModel.findByIdAndUpdate(docId, { slotes_bookes: slots_booked });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Appointment Cancelled Successfully"
    });
  }
);
const payOnline = tryCatchHanler(
  async (req, res, next) => {
    const userId = req.userId;
    const { appointmentId } = req.body;

    // 1. Fetch appointment data
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // 2. Fix: Compare IDs after converting to String
    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized action"
      });
    }

    // 3. Mark appointment status as cancelled in appointment collection
    await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });

    

    return res.status(200).json({
      success: true,
      message: "Paied Successfully"
    });
  }
);
export {
    registerUser, loginUser, userDetail, UpdateUserDetail, bookAppointment, getSingleUserAppointment
    ,cancelAppointment ,payOnline
}