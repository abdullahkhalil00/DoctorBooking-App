import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const [doctortoken, setdoctortoken] = useState(
        localStorage.getItem('doctortoken') ? localStorage.getItem('doctortoken') : ''
    );
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [AppointmentList, setAppointmentList] = useState([]);
    const [doctorProfile , setDoctorProfile] = useState([])
    const getDoctorAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
                headers: { doctortoken }
            });
            
            console.log(data); // Debug API Response

           
            if (data.success) {
                console.log("Inside IF Block:", data);
                setAppointmentList(data.AppointmentList);
            } else {
               
                toast.error(data.message);
            }
        } catch (error) {
            // FIX: error response handling
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (doctortoken) {
            getDoctorAppointments();
        }
    }, [doctortoken]);

    useEffect(() => {
        console.log("Updated AppointmentList State:", AppointmentList);
    }, [AppointmentList]);

    const value = {
        setdoctortoken,
        doctortoken,
        backendUrl,
        getDoctorAppointments,
        AppointmentList , doctorProfile , setDoctorProfile
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;