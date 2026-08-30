import React, { useContext } from 'react'
import { AdminContext } from '../context/adminContext'
import { DoctorContext } from '../context/doctorContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const SideBar = () => {
  const { atoken } = useContext(AdminContext)
  const { doctortoken } = useContext(DoctorContext)

  const activeClass = ({ isActive }) =>
    `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer ${
      isActive ? 'bg-[#F2F3FF] border-r-4 border-indigo-600 font-medium text-gray-800' : ''
    }`

  return (
    <div className="min-h-screen bg-white border-r border-gray-200">
      
      {/* Admin Sidebar Links */}
      {atoken && (
        <ul className="text-[#515151] mt-5">
          <NavLink to={'/admin-dashbord'} className={activeClass}>
            <img className="w-5" src={assets.home_icon} alt="Dashboard" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink to={'/all-appointments'} className={activeClass}>
            <img className="w-5" src={assets.appointment_icon} alt="Appointments" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink to={'/add-doctor'} className={activeClass}>
            <img className="w-5" src={assets.add_icon} alt="Add Doctor" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>

          <NavLink to={'/all-doctors'} className={activeClass}>
            <img className="w-5" src={assets.people_icon} alt="Doctors List" />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>
        </ul>
      )}

      {/* Doctor Sidebar Links */}
      {doctortoken && (
        <ul className="text-[#515151] mt-5">
          <NavLink to={'/doctor-dashboard'} className={activeClass}>
            <img className="w-5" src={assets.home_icon} alt="Dashboard" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink to={'/doctor-appointments'} className={activeClass}>
            <img className="w-5" src={assets.appointment_icon} alt="Appointments" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink to={'/doctor-profile'} className={activeClass}>
            <img className="w-5" src={assets.people_icon} alt="Profile" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}

    </div>
  )
}

export default SideBar