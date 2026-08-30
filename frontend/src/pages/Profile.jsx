import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Profile = () => {
  const { userData, setUserData, backendUrl, userToken, getSingleUserDetail, image, setImage, imageURL, setImageURL } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  // const [image, setImage] = useState(false) // New Image File State

  if (!userData || userData.length === 0) {
    return <div className="pt-5 text-neutral-600">Loading user profile...</div>
  }

  const user = userData[0]

  const handleUpdate = (field, value) => {
    setUserData((prev) => {
      const updatedArray = [...prev]
      updatedArray[0] = {
        ...updatedArray[0],
        [field]: value,
      }
      return updatedArray
    })
  }

  const handleAddressUpdate = (lineKey, value) => {
    setUserData((prev) => {
      const updatedArray = [...prev]
      updatedArray[0] = {
        ...updatedArray[0],
        address: {
          ...(updatedArray[0]?.address || {}),
          [lineKey]: value,
        },
      }
      return updatedArray
    })
  }

  // Update Profile with FormData (Supports Image + Text Data)
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()

      formData.append('name', user.name || '')
      formData.append('phone', user.phone || '')
      formData.append('gender', user.gender || 'Male')
      formData.append('dob', user.dob || '')
      formData.append('address', JSON.stringify(user.address || {}))

      // Append image only if selected by user
      if (image) {
        formData.append('image', image)
      }

      const { data } = await axios.put(
        `${backendUrl}/api/user/updateProfile`,
        formData,
        { headers: { usertoken: userToken } }
      )
      setImageURL(data.data.image)
     
      if (data.success) {
        toast.success(data.message || "Profile updated successfully")
        await getSingleUserDetail()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

      {/* Profile Image with Edit Preview */}
      <div className='flex items-center gap-4 mb-4'>
        {isEdit ? (
          <label htmlFor="image" className='cursor-pointer relative inline-block'>
            <img
              className='w-36 rounded-lg opacity-75 hover:opacity-100 transition-all'
              src={image ? URL.createObjectURL(image) : (user?.image || assets.profile_pic)}
              alt="Profile"
            />
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
              accept="image/*"
            />
          </label>
        ) : (
          <img
            className='w-36 rounded-lg'
            src={user?.image || assets.profile_pic}
            alt="Profile"
          />
        )}
      </div>

      {/* Name Input */}
      {isEdit ? (
        <input
          className='bg-gray-50 text-3xl font-medium max-w-60 mt-4 border border-gray-300 rounded p-1 outline-none'
          type="text"
          value={user?.name || ''}
          onChange={(e) => handleUpdate('name', e.target.value)}
        />
      ) : (
        <p className='font-medium text-3xl text-neutral-800 mt-4'>
          {user?.name}
        </p>
      )}

      <hr className='bg-zinc-400 h-[1px] border-none' />

      {/* Contact Info */}
      <div>
        <p className='text-neutral-500 underline mt-3 uppercase tracking-wider text-xs font-semibold'>
          Contact Information
        </p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{user?.email}</p>

          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input
              className='bg-gray-100 max-w-52 border border-gray-300 rounded px-2 py-0.5 outline-none text-blue-500'
              type="text"
              value={user?.phone || ''}
              onChange={(e) => handleUpdate('phone', e.target.value)}
            />
          ) : (
            <p className='text-blue-400'>{user?.phone || 'N/A'}</p>
          )}

          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <div>
              <input
                className='bg-gray-50 border border-gray-300 rounded px-2 py-0.5 outline-none mb-1 w-full'
                type="text"
                value={user?.address?.line1 || ''}
                onChange={(e) => handleAddressUpdate('line1', e.target.value)}
              />
              <input
                className='bg-gray-50 border border-gray-300 rounded px-2 py-0.5 outline-none w-full'
                type="text"
                value={user?.address?.line2 || ''}
                onChange={(e) => handleAddressUpdate('line2', e.target.value)}
              />
            </div>
          ) : (
            <p className='text-gray-500'>
              {user?.address?.line1 || 'No address line 1'}
              <br />
              {user?.address?.line2 || 'No address line 2'}
            </p>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <p className='text-neutral-500 underline mt-3 uppercase tracking-wider text-xs font-semibold'>
          Basic Information
        </p>

        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {isEdit ? (
            <select
              className='max-w-36 bg-gray-100 border border-gray-300 rounded px-2 py-0.5 outline-none'
              value={user?.gender || ''}
              onChange={(e) => handleUpdate('gender', e.target.value)}
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className='text-gray-400'>{user?.gender || 'Not Specified'}</p>
          )}

          <p className='font-medium'>Birthday:</p>
          {isEdit ? (
            <input
              className='max-w-28 bg-gray-100 border border-gray-300 rounded px-2 py-0.5 outline-none'
              type="date"
              value={user?.dob || ''}
              onChange={(e) => handleUpdate('dob', e.target.value)}
            />
          ) : (
            <p className='text-gray-400'>{user?.dob || 'Not Specified'}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className='mt-10 flex gap-4'>
        {isEdit ? (
          <button
            className='border border-[#5F6FFF] text-[#5F6FFF] px-8 py-2 rounded-full hover:bg-[#5F6FFF] hover:text-white transition-all duration-300'
            onClick={updateUserProfileData}
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

export default Profile