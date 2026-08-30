import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docID }) => {
  const { allDoctors } = useContext(AppContext)
  const [filterDoc, setFilterDoc] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (allDoctors.length > 0 && speciality) {
      // Exclude current doctor and filter by same specialty, limit to 5
      const doctorsData = allDoctors.filter(
        doc => doc.speciality === speciality && String(doc._id) !== String(docID)
      )
      setFilterDoc(doctorsData.slice(0, 5))
    }
  }, [allDoctors, speciality, docID])

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      {/* ----- Section Header ----- */}
      <h1 className='text-3xl font-medium'>Related Doctors</h1>
      <p className='sm:w-1/3 text-center text-sm text-gray-600'>
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* ----- Doctors Grid Container ----- */}
      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
        {filterDoc.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`)
              window.scrollTo(0, 0)
            }}
            className='border border-blue-100 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-500 bg-white'
          >
            {/* Card Image */}
            <div className='bg-[#EAEFFF]'>
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
    </div>
  )
}

export default RelatedDoctors