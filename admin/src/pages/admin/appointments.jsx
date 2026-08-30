import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/adminContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
const Appointments = () => {
  const { atoken, appointmentList, getAllAppointments, cancelAppointment, backendUrl } = useContext(AdminContext);

  useEffect(() => {
    if (atoken) {
      getAllAppointments();
    }
  }, [atoken]);

  const cancelAppointmentHandler = async (appointmentId) => {
    try {
      // Fixed header name to 'token' (match your backend auth middleware)
      const { data } = await axios.put(`${backendUrl}/api/admin/cancel-appointment`, { appointmentId }, {
        headers: { admintoken: atoken }
      });

      if (data.success) {
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {

      toast.error(error.response?.data?.message || error.message);
    }
  }

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (slotDate, slotTime) => {
    if (!slotDate) return '';
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateArray = slotDate.split('_');
    const day = dateArray[0];
    const monthIndex = Number(dateArray[1]) - 1;
    const year = dateArray[2];

    return `${day} ${months[monthIndex]}, ${year} | ${slotTime}`;
  };

  return (
    <div className='w-full max-w-6xl m-5 px-2 sm:px-0'>
      <p className='mb-3 text-lg font-medium text-gray-700'>All Appointments</p>

      {/* Outer wrapper for mobile overflow control */}
      <div className='bg-white border rounded text-sm overflow-x-auto'>

        <div className='min-w-[700px]'>
          {/* Table Header */}
          <div className='grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1fr] grid-flow-col py-3 px-6 border-b text-gray-600 bg-gray-50 font-medium'>
            <p>#</p>
            <p>Patient</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Doctor</p>
            <p>Fees</p>
            <p>Action</p>
          </div>

          {/* List Rows */}
          {appointmentList && appointmentList.map((item, index) => (
            <div
              key={item._id || index}
              className='grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 transition-all'
            >
              <p>{index + 1}</p>

              {/* Patient Name & Image */}
              <div className='flex items-center gap-2'>
                <img
                  src={item.userData?.image}
                  alt="Patient"
                  className='w-8 h-8 rounded-full object-cover min-w-[32px]'
                />
                <p className='text-gray-800 font-medium truncate'>{item.userData?.name || 'N/A'}</p>
              </div>

              {/* Age */}
              <p>{calculateAge(item.userData?.dob)}</p>

              {/* Date & Time */}
              <p className='truncate'>{formatDate(item.slotDate, item.slotTime)}</p>

              {/* Doctor Name & Image */}
              <div className='flex items-center gap-2'>
                <img
                  src={item.docData?.image}
                  alt="Doctor"
                  className='w-8 h-8 rounded-full object-cover bg-gray-200 min-w-[32px]'
                />
                <p className='text-gray-800 font-medium truncate'>{item.docData?.name || 'N/A'}</p>
              </div>

              {/* Fees */}
              <p>${item.amount}</p>

              {/* Action Buttons */}
              <div>
                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <img
                    onClick={() =>  cancelAppointmentHandler(item._id)}
                    src={assets?.cancel_icon}
                    alt="Cancel"
                    className='w-10 cursor-pointer'
                  />
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Appointments;