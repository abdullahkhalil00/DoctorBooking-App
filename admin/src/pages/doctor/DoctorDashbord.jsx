import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/doctorContext'

const DoctorDashboard = () => {
  const { doctortoken, getDoctorAppointments, AppointmentList } = useContext(DoctorContext)

  useEffect(() => {
    if (doctortoken) {
      getDoctorAppointments()
    }
  }, [doctortoken])

  // Dynamic Metrics Calculation
  const totalEarnings = AppointmentList.reduce((acc, item) => item.isCompleted || item.payment ? acc + item.amount : acc, 0)
  const totalPatients = new Set(AppointmentList.map(item => item.userId)).size
  const latestAppointments = [...AppointmentList].reverse().slice(0, 5)

  return (
    <div className="m-5">
      {/* Top Stats Cards */}
      <div className="flex flex-wrap gap-3">
        {/* Total Earnings */}
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <div>
            <p className="text-xl font-semibold text-gray-600">${totalEarnings}</p>
            <p className="text-gray-400 text-sm">Earnings</p>
          </div>
        </div>

        {/* Total Appointments */}
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <div>
            <p className="text-xl font-semibold text-gray-600">{AppointmentList.length}</p>
            <p className="text-gray-400 text-sm">Appointments</p>
          </div>
        </div>

        {/* Unique Patients */}
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <div>
            <p className="text-xl font-semibold text-gray-600">{totalPatients}</p>
            <p className="text-gray-400 text-sm">Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className="bg-white rounded border border-gray-200 mt-10">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b">
          <p className="font-semibold text-gray-700">Latest Bookings</p>
        </div>

        <div className="pt-4 border-t-0">
          {latestAppointments.map((item, index) => (
            <div key={index} className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100 border-b last:border-b-0">
              <img className="rounded-full w-10 h-10 object-cover" src={item.userData.image} alt="User" />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.userData.name}</p>
                <p className="text-gray-600 text-xs">Booking on {item.slotDate} | {item.slotTime}</p>
              </div>
              <div>
                {item.cancelled ? (
                  <span className="text-red-500 text-xs font-medium">Cancelled</span>
                ) : item.isCompleted ? (
                  <span className="text-green-500 text-xs font-medium">Completed</span>
                ) : (
                  <span className="text-yellow-600 text-xs font-medium">Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard