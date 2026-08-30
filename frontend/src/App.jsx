import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Doctor from './pages/Doctors.jsx'
import Appointment from './pages/Appointment.jsx'
import MyAppointment from './pages/MyAppointment.jsx'
import Profile from './pages/Profile.jsx'
import Contact from './pages/Context.jsx'
import Login from './pages/Login.jsx'
import Navbar from './componenet/Navbar.jsx'
import Footer from './componenet/Footer.jsx'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={<Login />} />
        <Route path='/doctors' element={<Doctor />} />
        <Route path='/doctors/:speciality' element={<Doctor />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<Profile />} />
        <Route path='/my-appointments' element={<MyAppointment />} />
        <Route path='/appointment/:docID' element={<Appointment />} />

      </Routes>
      <Footer />
    </div>
  )
}

export default App