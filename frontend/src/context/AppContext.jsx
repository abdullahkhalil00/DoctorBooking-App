import { createContext, useState, useEffect } from "react";
import { doctors } from "../assets/assets_frontend/assets";
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const currency = '$';
    const [image, setImage] = useState(false)
    const [userData, setUserData] = useState([]);
    const [allDoctors, setAlldoctors] = useState([]);
    const [userToken, setUserToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
    const [imageURL, setImageURL] = useState('')

    // Get All Doctors List
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);

            if (data.success) {
                setAlldoctors(data.allDoctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Get Logged-In User Details
    const getSingleUserDetail = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/userDetail`, {
                headers: { usertoken: userToken }
            });

            if (data.success) {
                setUserData([data.data]);
                setImageURL(data.data.image ? data.data.image : '')
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };
   

    const value = {
        doctors,
        currency,
        allDoctors,
        getAllDoctors,
        userToken,
        setUserToken,
        backendUrl,
        userData,
        setUserData,
        getSingleUserDetail,
        image, setImage, imageURL, setImageURL
    };

    
    // Fetch initial doctors list
    useEffect(() => {

        getAllDoctors();
    }, [imageURL]);
    

    // FIX: Removed `userData` from dependencies to break infinite loop
    useEffect(() => {
        if (userToken) {
            getSingleUserDetail();
        } else {
            setUserData([]);
        }
    }, [userToken]);

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;