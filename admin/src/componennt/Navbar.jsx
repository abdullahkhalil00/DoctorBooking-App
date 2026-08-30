import React, { useContext } from 'react'
import { AdminContext } from '../context/adminContext'
import { DoctorContext } from '../context/doctorContext'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const { atoken, setatoken } = useContext(AdminContext)
    const { doctortoken, setdoctortoken } = useContext(DoctorContext)
    const navigate = useNavigate()

    // Logout Functionality (Admin & Doctor dono ke liye)
    const logout = () => {
        navigate('/')
        
        if (atoken) {
            setatoken('')
            localStorage.removeItem('atoken')
        }

        if (doctortoken) {
            setdoctortoken('')
            localStorage.removeItem('doctortoken')
        }
    }

    return (
        <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
            {/* Logo and Role Badge */}
            <div className="flex items-center gap-2 text-xs">
                <img 
                    onClick={() => navigate('/')}
                    className="w-36 sm:w-40 cursor-pointer" 
                    src={assets.admin_logo} 
                    alt="Logo" 
                />
                <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 font-medium">
                    {atoken ? 'Admin' : 'Doctor'}
                </p>
            </div>

            {/* Logout Button */}
            <button 
                onClick={logout} 
                className="bg-indigo-600 text-white text-sm px-10 py-2 rounded-full hover:bg-indigo-700 transition-all cursor-pointer"
            >
                Logout
            </button>
        </div>
    )
}

export default Navbar