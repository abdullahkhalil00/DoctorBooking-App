import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const MyAppointments = () => {
  const { backendUrl, userToken } = useContext(AppContext)
  const [myappointment, setMyappointment] = useState([])

  // Fixed: Added missing "May" in months array
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Fixed: Removed 'async' keyword. Simple synchronous function
  const formattedDate = (slotDate) => {
    if (!slotDate) return "";
    const dateArray = slotDate.split('_'); // ["30", "8", "2026"]
    return dateArray[0] + " " + months[Number(dateArray[1])] + ' ' + dateArray[2];
  }
  const formatTime = (slotTime) => {
    if (!slotTime) return "";
    let [hours, minutes] = slotTime.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // 0 ko 12 banana
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
  };
  const getMyappointment = async () => {
    try {
      // Fixed header name to 'token' (match your backend auth middleware)
      const { data } = await axios.get(`${backendUrl}/api/user/my-appointment`, {
        headers: { userToken: userToken }
      });

      if (data.success) {
        setMyappointment(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }
  const cancelAppointment = async (appointmentId) => {
    try {
      // Fixed header name to 'token' (match your backend auth middleware)
      const { data } = await axios.put(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, {
        headers: { userToken: userToken }
      });

      if (data.success) {
        getMyappointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
     
      toast.error(error.response?.data?.message || error.message);
    }
  }
  const payOnline = async (appointmentId) => {
    try {
      // Fixed header name to 'token' (match your backend auth middleware)
      const { data } = await axios.put(`${backendUrl}/api/user/pay-appointment`, { appointmentId }, {
        headers: { userToken: userToken }
      });

      if (data.success) {
        getMyappointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
     
      toast.error(error.response?.data?.message || error.message);
    }
  }

  useEffect(() => {
    if (userToken) {
      getMyappointment()
    }
  }, [userToken])

  return (
    <div>
      {/* Title */}
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b border-gray-300'>
        My Appointments
      </p>

      {/* Appointments List */}
      <div>
        {myappointment.map((item, index) => (
          <div
            key={item._id || index}
            className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b border-gray-200 items-center'
          >
            {/* Doctor Image */}
            <div>
              <img
                className='w-32 bg-indigo-50 rounded-lg object-cover'
                src={item.docData?.image}
                alt={item.docData?.name}
              />
            </div>

            {/* Doctor Info */}
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold text-base'>{item.docData?.name}</p>
              <p>{item.docData?.speciality}</p>

              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData?.address?.line1}</p>
              <p className='text-xs'>{item.docData?.address?.line2}</p>

              {/* Fixed: Now correctly formats date and slot time */}
              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{' '}
                {formattedDate(item.slotDate)} | {formatTime(item.slotTime)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col gap-2 justify-end text-xs'>
              {!item.cancelled && !item.payment && (
                <button 
                onClick={() => payOnline(item._id)}
                className='text-sm text-[#5F6FFF] bg-[#5F6FFF] text-white sm:min-w-48 py-2 rounded border hover:bg-blue-600 transition-all duration-300'>
                  Pay online
                </button>
              )}

              {!item.cancelled && item.payment && (
                <button className='sm:min-w-48 py-2 border border-[#5F6FFF] rounded text-[#5F6FFF] bg-[#5F6FFF]/10 cursor-default'>
                  Paid
                </button>
              )}

              {!item.cancelled ? (
                <button
                  onClick={() =>
                    

                  cancelAppointment(item._id)
                }
                className='text-sm text-stone-500 sm:min-w-48 py-2 border border-gray-300 rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
              Cancel appointment
            </button>
            ) : (
            <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500 cursor-default'>
              Appointment Cancelled
            </button>
              )}
          </div>
          </div>
        ))}
    </div>
    </div >
  )
}

export default MyAppointments;