import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [atoken, setatoken] = useState(localStorage.getItem('atoken') ? localStorage.getItem('atoken') : '');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [allDoctors, setAlldoctors] = useState([]);
    const [appointmentList, setAppointmentList] = useState([]);

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', {
                headers: { admintoken: atoken }
            });

            if (data.success) {
                setAlldoctors(data.allDoctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, {
                headers: { admintoken: atoken }
            });

            if (data.success) {
                toast.success(data.message);
                getAllDoctors(); // Refresh local list after toggling state
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointment-list', {
                headers: { admintoken: atoken }
            });

            if (data.success) {
                
                setAppointmentList(data.AppointmentList.reverse()); // Correctly set data payload

            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (atoken) {
            getAllDoctors();
            getAllAppointments();
        }
    }, [atoken]);
    
    const value = {
        atoken,
        setatoken,
        backendUrl,
        allDoctors,
        getAllDoctors,
        changeAvailability,
        appointmentList,
        getAllAppointments,
        
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;