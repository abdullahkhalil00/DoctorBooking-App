import React, { useContext } from 'react'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/adminContext.jsx'
import { DoctorContext } from './context/doctorContext.jsx'
import Navbar from './componennt/Navbar.jsx'
import SideBar from './componennt/SideBar.jsx'
import { Route, Routes, Navigate } from 'react-router-dom'

// Pages imports
import Dashbord from './pages/admin/dashbord.jsx'
import Appointments from './pages/admin/appointments.jsx'
import Adddoctors from './pages/admin/addDoctor.jsx'
import AllDoctor from './pages/admin/AllDoctor.jsx'
import DoctorDashbord from './pages/doctor/DoctorDashbord.jsx'
import DoctorAppointments from './pages/doctor/DoctorAppointments.jsx'
import DoctorProfile from './pages/doctor/DoctorProfile.jsx'
import Login from './pages/login.jsx'



const App = () => {
  const { atoken } = useContext(AdminContext)
  const { doctortoken } = useContext(DoctorContext)
  // console.log(doctortoken)
  return atoken || doctortoken ? (
    <div className="bg-[#F8F9FD] min-h-screen">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <SideBar />
        <div className="flex-1 m-5">
          <Routes>
            {/* Auto Redirect to default dashboard */}
            <Route 
              path="/" 
              element={
                atoken 
                  ? <Navigate to="/admin-dashbord" /> 
                  : <Navigate to="/doctor-dashboard" />
              } 
            />

            {/* Admin Routes */}
            {atoken && (
              <>
                <Route path="/admin-dashbord" element={<Dashbord />} />
                <Route path="/all-appointments" element={<Appointments />} />
                <Route path="/add-doctor" element={<Adddoctors />} />
                <Route path="/all-doctors" element={<AllDoctor />} />
              </>
            )}

            {/* Doctor Routes */}
            {doctortoken && (
              <>
                <Route path="/doctor-dashboard" element={<DoctorDashbord />} />
                <Route path="/doctor-appointments" element={<DoctorAppointments />} />
                <Route path="/doctor-profile" element={<DoctorProfile />} />

              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App