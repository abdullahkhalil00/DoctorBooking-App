import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctos from '../componenet/RelatedDoctos'
import { toast } from 'react-toastify'
import axios from 'axios'
const Appointment = () => {
  const { doctors, currencySymbol, allDoctors, getAllDoctors, backendUrl, userToken } = useContext(AppContext)
  const { docID } = useParams()
  const [docInfo, setDocInfo] = useState(null)
  const navigate = useNavigate()
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const doc = allDoctors.find(doc => String(doc._id) === String(docID))
    setDocInfo(doc)
  }



  const getAvailableSlots = async () => {
    setDocSlots([])

    let today = new Date()
    let allSlots = []

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let startTime = new Date(currentDate)
      let endTime = new Date(currentDate)

      if (i === 0) {
        startTime.setHours(
          startTime.getHours() > 10 ? startTime.getHours() + 1 : 10
        )
        startTime.setMinutes(
          startTime.getMinutes() > 30 ? 30 : 0
        )
      } else {
        startTime.setHours(10)
        startTime.setMinutes(0)
      }

      endTime.setHours(21)
      endTime.setMinutes(0)

      let timeSlots = []

      while (startTime < endTime) {
        let formattedTime = startTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }).toLowerCase()
        let day = startTime.getDate();
        let month = startTime.getMonth() + 1
        let year = startTime.getFullYear();

        const slotDate = day +"_"+month+"_"+year
        const slotTime = formattedTime;
        const isSlotAvailable = docInfo.slotes_bookes[slotDate] && docInfo.slotes_bookes[slotDate].includes(slotTime) ? false : true;

        if(isSlotAvailable){

          timeSlots.push({
            dateTime: new Date(startTime),
            time: formattedTime
          })
        }

        startTime.setMinutes(startTime.getMinutes() + 30)
      }

      allSlots.push({
        date: currentDate,
        slots: timeSlots
      })
    }

    setDocSlots(allSlots)
  }
  const bookAppointment = async () => {

    if (!userToken) {
      toast.warn("login to book appointment")
      return navigate('/login')
    }

    try {
      const date = docSlots[slotIndex].date;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;
      console.log(slotDate, slotTime)
      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docID, slotDate, slotTime }, {
        headers: { usertoken: userToken }
      })
      if (data.success) {
        toast.success(data.message)
        getAllDoctors()
        navigate('/my-appointments')
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;

      toast.error(errorMessage); // Ab "Select date and time both" toast hoga
      
    }

  }

  useEffect(() => {
    if (allDoctors.length > 0) {
      fetchDocInfo()
    }
  }, [allDoctors, docID])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
    }
  }, [docInfo])

  return docInfo && (
    <div className='max-w-6xl mx-auto px-4'>
      {/* ----- Doctor Details Section ----- */}
      <div className='flex flex-col sm:flex-row gap-4 mt-8'>
        {/* ----- Left Side: Doctor Image ----- */}
        <div className='bg-[#5F6FFF] w-full sm:max-w-72 rounded-lg flex justify-center items-end overflow-hidden'>
          <img className='w-full h-auto object-cover' src={docInfo.image} alt={docInfo.name} />
        </div>

        {/* ----- Right Side: Doctor Details ----- */}
        <div className='flex-1 border border-gray-300 rounded-lg p-8 py-7 bg-white'>
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="verified" />
          </p>

          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2.5 border text-xs rounded-full border-gray-400 text-gray-700'>
              {docInfo.experience}
            </button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <img className='w-3.5' src={assets.info_icon} alt="info" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1 leading-relaxed'>
              {docInfo.about}
            </p>
          </div>

          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-800 font-semibold'>{currencySymbol || '$'}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* ----- Booking Slots Section ----- */}
      <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-gray-700'>
        <p className='text-lg font-medium text-gray-800'>Booking slots</p>

        {/* Days Selector - Hidden Scrollbar with `overflow-x-auto` & `[::-webkit-scrollbar]:hidden` */}
        <div className='flex gap-3 items-center w-full overflow-x-auto mt-4 pb-2 [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          {docSlots.length > 0 &&
            docSlots.map((item, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-[64px] rounded-full cursor-pointer transition-all duration-200 flex-shrink-0 ${slotIndex === index
                  ? 'bg-[#5F6FFF] text-white shadow-md'
                  : 'border border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
              >
                <p className='text-xs font-semibold'>{item.date && daysOfWeek[item.date.getDay()]}</p>
                <p className='text-lg font-semibold mt-1'>{item.date && item.date.getDate()}</p>
              </div>
            ))}
        </div>

        {/* Time Slots Selector - Hidden Scrollbar */}
        <div className='flex items-center gap-3 w-full overflow-x-auto mt-4 pb-2 [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          {docSlots.length > 0 && docSlots[slotIndex]?.slots.map((item, index) => (
            <p
              key={index}
              onClick={() => setSlotTime(item.time)}
              className={`text-xs font-light flex-shrink-0 px-5 py-2.5 rounded-full cursor-pointer transition-all duration-200 ${item.time === slotTime
                ? 'bg-[#5F6FFF] text-white shadow-sm'
                : 'text-gray-600 border border-gray-300 hover:border-gray-400'
                }`}
            >
              {item.time}
            </p>
          ))}
        </div>

        {/* Booking Button */}
        <button
          onClick={() => bookAppointment()}
          className='bg-[#5F6FFF] text-white text-sm font-light px-12 py-3 rounded-full my-6 hover:bg-blue-600 transition-all duration-200 shadow-md'>
          Book an appointment
        </button>
      </div>


      <RelatedDoctos docID={docID} speciality={docInfo.speciality} />
    </div>
  )
}

export default Appointment