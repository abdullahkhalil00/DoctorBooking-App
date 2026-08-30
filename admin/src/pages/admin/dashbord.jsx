import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/adminContext';
import { assets } from '../../assets/assets';

const Dashboard = () => {
  const { 
    atoken, 
    allDoctors, 
    appointmentList, 
    getAllDoctors, 
    getAllAppointments, 
    cancelAppointment 
  } = useContext(AdminContext);

  useEffect(() => {
    if (atoken) {
      getAllDoctors();
      getAllAppointments();
    }
  }, [atoken]);

  // Helper to format slotDate ("29_8_2026") into a readable string
  const formatDate = (slotDate) => {
    if (!slotDate) return '';
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateArray = slotDate.split('_');
    const day = dateArray[0];
    const monthIndex = Number(dateArray[1]) - 1;
    const year = dateArray[2];

    return `${day} ${months[monthIndex]}, ${year}`;
  };

  // Get unique patients count
  const uniquePatients = new Set(appointmentList.map((item) => item.userId)).size;

  return (
    <div className='m-5 w-full max-w-5xl'>
      
      {/* Metrics Cards Container */}
      <div className='flex flex-wrap gap-5 mb-8'>
        
        {/* Doctors Count Card */}
        <div className='flex items-center gap-4 bg-white p-4 min-w-[220px] rounded-lg border border-gray-100 shadow-sm hover:scale-105 transition-all cursor-pointer'>
          <img className='w-14 bg-blue-50 p-3 rounded-md' src={assets?.doctor_icon} alt="Doctors" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{allDoctors.length}</p>
            <p className='text-gray-400 text-sm'>Doctors</p>
          </div>
        </div>

        {/* Appointments Count Card */}
        <div className='flex items-center gap-4 bg-white p-4 min-w-[220px] rounded-lg border border-gray-100 shadow-sm hover:scale-105 transition-all cursor-pointer'>
          <img className='w-14 bg-blue-50 p-3 rounded-md' src={assets?.appointments_icon} alt="Appointments" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{appointmentList.length}</p>
            <p className='text-gray-400 text-sm'>Appointments</p>
          </div>
        </div>

        {/* Patients Count Card */}
        <div className='flex items-center gap-4 bg-white p-4 min-w-[220px] rounded-lg border-2 border-blue-500 shadow-sm hover:scale-105 transition-all cursor-pointer'>
          <img className='w-14 bg-blue-50 p-3 rounded-md' src={assets?.patients_icon} alt="Patients" />
          <div>
            <p className='text-xl font-semibold text-gray-700'>{uniquePatients}</p>
            <p className='text-gray-400 text-sm'>Patients</p>
          </div>
        </div>

      </div>

      {/* Latest Appointments List Container */}
      <div className='bg-white border rounded-lg shadow-sm'>
        
        {/* Header Title */}
        <div className='flex items-center gap-2.5 px-6 py-4 border-b rounded-t-lg bg-white'>
          <img className='w-5' src={assets?.list_icon} alt="Latest Appointments" />
          <p className='font-semibold text-gray-800 text-base'>Latest Appointment</p>
        </div>

        {/* List Items */}
        <div className='divide-y divide-gray-100'>
          {appointmentList.slice(0, 5).map((item, index) => (
            <div 
              key={item._id || index} 
              className='flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <img 
                  src={item.docData?.image} 
                  alt={item.docData?.name} 
                  className='w-10 h-10 rounded-full object-cover bg-gray-100' 
                />
                <div>
                  <p className='text-gray-800 font-medium text-sm'>{item.docData?.name}</p>
                  <p className='text-gray-400 text-xs mt-0.5'>
                    Booking on {formatDate(item.slotDate)}
                  </p>
                </div>
              </div>

              {/* Status Action */}
              <div>
                {item.cancelled ? (
                  <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                ) : item.isCompleted ? (
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                ) : (
                  <img 
                    onClick={() => cancelAppointment && cancelAppointment(item._id)} 
                    src={assets?.cancel_icon} 
                    alt="Cancel" 
                    className='w-9 cursor-pointer hover:opacity-80 transition-opacity'
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

export default Dashboard;