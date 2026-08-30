import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets_frontend/assets'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <div className='relative flex bg-indigo-600 rounded-[12px] px-6 sm:px-10 md:px-12 my-20 md:mx-10 max-w-[1430px] h-[260px] sm:h-[300px] md:h-[320px] overflow-visible'>
      
      {/* Left Side */}
      <div className='flex-1 py-6 sm:py-8 flex flex-col justify-center'>
        <div className='text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-snug'>
          <p>Book Appointment</p>
          <p className='mt-1 sm:mt-2'>With 100+ Trusted Doctors</p>
        </div>
        
        <div>
          <button 
            onClick={() => { navigate('/login'); scrollTo(0, 0) }} 
            className='bg-white text-xs sm:text-sm text-gray-600 px-7 py-2.5 rounded-full mt-5 hover:scale-105 transition-all duration-300'
          >
            Create account
          </button>
        </div>
      </div>

      {/* Right Side - Image height increased & pulled higher up */}
      <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
        <img 
          className='w-[320px] lg:w-[390px] absolute  right-0 -top-16 h-[120%] object-contain pointer-events-none' 
          src={assets.appointment_img} 
          alt="appointment doctor" 
        />
      </div>

    </div>
  )
}

export default Banner