import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/doctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const { doctorProfile, setDoctorProfile, backendUrl, doctortoken } = useContext(DoctorContext)
  const [isEdit, setIsEdit] = useState(false)

  // 1. Fetch Doctor Profile Details API Call
  const getDoctorProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/doctor/doctor-profile`,
        { headers: { doctortoken } }
      )
      console.log(data)
      if (data.success) {
        setDoctorProfile(data.profileData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  // Initial Fetch on component mount or token change
  useEffect(() => {
    if (doctortoken) {
      getDoctorProfileData()
    }
  }, [doctortoken])

  if (!doctorProfile) {
    return <div className="pt-5 text-neutral-600">Loading doctor profile...</div>
  }

  // Local State Input Handlers
  const handleUpdate = (field, value) => {
    setDoctorProfile((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddressUpdate = (lineKey, value) => {
    setDoctorProfile((prev) => ({
      ...prev,
      address: {
        ...(prev?.address || {}),
        [lineKey]: value
      }
    }))
  }

  // 2. Change / Update Doctor Profile API Call
  const updateProfileData = async () => {
    try {
      const updateData = {
        fees: doctorProfile.fees,
        about: doctorProfile.about,
        available: doctorProfile.available,
        address: doctorProfile.address
      }

      const { data } = await axios.put(
        `${backendUrl}/api/doctor/change-profile`,
        updateData,
        { headers: { doctortoken } }
      )

      if (data.success) {
        toast.success(data.message || "Profile updated successfully")
        setIsEdit(false)
        await getDoctorProfileData() // Refetch fresh data after update
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm pt-5 m-5'>

      {/* Profile Image */}
      <div className='flex items-center gap-4 mb-4'>
        <img
          className='w-36 rounded-lg bg-[#5F6FFF]/10 object-cover'
          src={doctorProfile?.image}
          alt="Doctor Profile"
        />
      </div>

      {/* Doctor Name & Speciality */}
      <p className='font-medium text-3xl text-neutral-800 mt-2'>
        {doctorProfile?.name}
      </p>

      <div className='flex items-center gap-2 text-gray-600 mt-1'>
        <p>{doctorProfile?.degree} - {doctorProfile?.speciality}</p>
        <span className='py-0.5 px-2 border text-xs rounded-full border-gray-400'>
          {doctorProfile?.experience}
        </span>
      </div>

      {/* About Section */}
      <div>
        <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>
          About:
        </p>
        {isEdit ? (
          <textarea
            className='w-full bg-gray-50 border border-gray-300 rounded p-2 mt-1 outline-none text-gray-600'
            rows={4}
            value={doctorProfile?.about || ''}
            onChange={(e) => handleUpdate('about', e.target.value)}
          />
        ) : (
          <p className='text-sm text-gray-600 mt-1 max-w-[700px]'>
            {doctorProfile?.about}
          </p>
        )}
      </div>

      {/* Fees */}
      <p className='text-[#5F6FFF] font-medium mt-3'>
        Appointment fee: <span className='text-gray-800'>
          ${isEdit ? (
            <input
              className='bg-gray-50 border border-gray-300 rounded px-2 py-0.5 outline-none max-w-20 ml-1'
              type="number"
              value={doctorProfile?.fees || ''}
              onChange={(e) => handleUpdate('fees', Number(e.target.value))}
            />
          ) : (
            doctorProfile?.fees
          )}
        </span>
      </p>

      <hr className='bg-zinc-400 h-[1px] border-none my-2' />

      {/* Address & Availability */}
      <div>
        <p className='text-neutral-500 underline uppercase tracking-wider text-xs font-semibold'>
          Address & Status
        </p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <div>
              <input
                className='bg-gray-50 border border-gray-300 rounded px-2 py-0.5 outline-none mb-1 w-full'
                type="text"
                value={doctorProfile?.address?.line1 || ''}
                onChange={(e) => handleAddressUpdate('line1', e.target.value)}
              />
              <input
                className='bg-gray-50 border border-gray-300 rounded px-2 py-0.5 outline-none w-full'
                type="text"
                value={doctorProfile?.address?.line2 || ''}
                onChange={(e) => handleAddressUpdate('line2', e.target.value)}
              />
            </div>
          ) : (
            <p className='text-gray-500'>
              {doctorProfile?.address?.line1 || 'No line 1'}
              <br />
              {doctorProfile?.address?.line2 || 'No line 2'}
            </p>
          )}

          <p className='font-medium'>Availability:</p>
          <div className='flex items-center gap-2'>
            <input
              type="checkbox"
              id="available"
              checked={doctorProfile?.available || false}
              onChange={(e) => isEdit && handleUpdate('available', e.target.checked)}
              disabled={!isEdit}
              className='w-4 h-4 cursor-pointer'
            />
            <label htmlFor="available" className='cursor-pointer text-gray-600'>
              Available for Booking
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='mt-8 flex gap-4'>
        {isEdit ? (
          <button
            className='border border-[#5F6FFF] text-[#5F6FFF] px-8 py-2 rounded-full hover:bg-[#5F6FFF] hover:text-white transition-all duration-300'
            onClick={updateProfileData}
          >
            Save information
          </button>
        ) : (
          <button
            className='border border-[#5F6FFF] text-[#5F6FFF] px-8 py-2 rounded-full hover:bg-[#5F6FFF] hover:text-white transition-all duration-300'
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>

    </div>
  )
}

export default DoctorProfile