import React from 'react'
import { specialityData } from '../assets/assets_frontend/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-gray-800'>
      <p className='text-3xl font-medium'>Find by Speciality</p>
      <p className='sm:w-1/3 text-center text-sm'>
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>

      {/* flex-wrap add kiya gaya hai taake items next rows mein automatic shift hote jayein */}
      <div className='flex flex-wrap justify-center gap-6 pt-5 w-full max-w-4xl'>
        {specialityData.map((item, index) => (
          <Link 
            key={index} 
            onClick={() => scrollTo(0,0)}
            to={`/doctors/${item.speciality}`}
            className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:-translate-y-2 transition-all duration-500'
          >
            <img className='w-16 sm:w-24 mb-2' src={item.image} alt={item.speciality} />
            <p>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu