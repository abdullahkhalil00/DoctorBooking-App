import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
  const navigate = useNavigate()
  const {allDoctors} = useContext(AppContext)
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      {/* Header Info */}
      <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
      <p className='sm:w-1/3 text-center text-sm text-gray-600'>
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* Responsive Grid Layout */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {allDoctors.slice(0, 10).map((item, index) => (
          <div 
            key={index} 
            onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} 
            className='border border-blue-100 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500'
          >
            {/* Image Container with Soft Blue Background */}
            <div className='bg-blue-50'>
              <img className='w-full h-auto object-cover' src={item.image} alt={item.name} />
            </div>

            {/* Card Content */}
            <div className='p-4'>
              <div className='flex items-center gap-2 text-xs text-center text-green-500 font-medium'>
                <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                <p>Available</p>
              </div>
              <p className='text-gray-900 text-lg font-medium mt-1'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

      {/* More Button */}
      <button 
        onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} 
        className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 hover:bg-indigo-100 transition-all duration-300'
      >
        more
      </button>
    </div>
  )
}

export default TopDoctors