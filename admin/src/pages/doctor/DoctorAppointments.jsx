import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/doctorContext'

const DoctorAppointments = () => {
  const { doctortoken, getDoctorAppointments, AppointmentList } = useContext(DoctorContext)

  useEffect(() => {
    if (doctortoken) {
      getDoctorAppointments()
    }
  }, [doctortoken])

  // DOB se Age calculate karne ke liye helper function
  const calculateAge = (dob) => {
    if (!dob) return 'N/A'
    const birthDate = new Date(dob)
    const ageDifMs = Date.now() - birthDate.getTime()
    const ageDate = new Date(ageDifMs)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium text-gray-700">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll shadow-sm">
        {/* Table Header */}
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_3fr_1fr] gap-1 py-3.5 px-6 border-b bg-gray-50 text-gray-600 font-semibold">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p className="text-center">Action</p>
        </div>

        {/* Table Body */}
        {AppointmentList.map((item, index) => (
          <div
            className="flex flex-wrap justify-between sm:grid grid-cols-[0.5fr_2fr_1fr_3fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 transition-all"
            key={item._id || index}
          >
            {/* Number */}
            <p className="max-sm:hidden font-medium">{index + 1}</p>

            {/* Patient Name & Image */}
            <div className="flex items-center gap-3">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={item.userData.image}
                alt="Patient"
              />
              <p className="font-medium text-gray-800">{item.userData.name}</p>
            </div>

            {/* Age */}
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>

            {/* Date & Time */}
            <p>
              {item.slotDate}, {item.slotTime}
            </p>

            {/* Cancel Action Icon */}
            <div className="flex justify-center">
              {item.cancelled ? (
                <span className="text-red-400 text-xs font-medium">Cancelled</span>
              ) : item.isCompleted ? (
                <span className="text-green-500 text-xs font-medium">Completed</span>
              ) : (
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-all font-bold text-sm"
                  title="Cancel Appointment"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorAppointments