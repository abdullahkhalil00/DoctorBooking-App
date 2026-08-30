import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/adminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddDoctor = () => {
    const { atoken, backendUrl } = useContext(AdminContext)

    // Loading State
    const [loading, setLoading] = useState(false)

    // Form States
    const [docImage, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            // Image validation
            if (!docImage) {
                return toast.error("Image not selected")
            }

            setLoading(true) // Disable button during request

            const formData = new FormData()
            formData.append('image', docImage)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('degree', degree)
            formData.append('speciality', speciality)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))
            formData.append('about', about)

            // API Call with exact backend header
            const { data } = await axios.post(
                `${backendUrl}/api/admin/add-doctor`,
                formData,
                { 
                    headers: { 
                        admintoken: atoken 
                    } 
                }
            )

            if (data.success) {
                toast.success(data.message)
                // Clear Form Fields
                setDocImg(false)
                setName('')
                setEmail('')
                setPassword('')
                setDegree('')
                setFees('')
                setAbout('')
                setAddress1('')
                setAddress2('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false) // Enable button after API response
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <p className="mb-3 text-lg font-medium">Add Doctor</p>

            {/* Form Container */}
            <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl">
                {/* Upload Image Section */}
                <div className="flex items-center gap-4 mb-8 text-gray-500">
                    <label htmlFor="doc-img">
                        <img
                            className="w-16 h-16 bg-gray-100 rounded-full cursor-pointer object-cover"
                            src={docImage ? URL.createObjectURL(docImage) : assets.upload_area}
                            alt="upload-image"
                        />
                    </label>
                    <input
                        onChange={(e) => setDocImg(e.target.files[0])}
                        type="file"
                        id="doc-img"
                        hidden
                    />
                    <p>Upload doctor <br /> picture</p>
                </div>

                {/* Two Column Input Grid */}
                <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
                    {/* Left Column */}
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                            <p>Doctor name</p>
                            <input
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                className="border rounded px-3 py-2 outline-none"
                                type="text"
                                placeholder="Name"
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Doctor Email</p>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="border rounded px-3 py-2 outline-none"
                                type="email"
                                placeholder="Your email"
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Doctor Password</p>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="border rounded px-3 py-2 outline-none"
                                type="password"
                                placeholder="Password"
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Experience</p>
                            <select
                                onChange={(e) => setExperience(e.target.value)}
                                value={experience}
                                className="border rounded px-3 py-2 outline-none"
                            >
                                <option value="1 Year">1 Year</option>
                                <option value="2 Years">2 Years</option>
                                <option value="3 Years">3 Years</option>
                                <option value="4 Years">4 Years</option>
                                <option value="5 Years">5 Years</option>
                                <option value="6 Years">6 Years</option>
                                <option value="7 Years">7 Years</option>
                                <option value="8 Years">8 Years</option>
                                <option value="9 Years">9 Years</option>
                                <option value="10 Years">10 Years</option>
                            </select>
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Fees</p>
                            <input
                                onChange={(e) => setFees(e.target.value)}
                                value={fees}
                                className="border rounded px-3 py-2 outline-none"
                                type="number"
                                placeholder="Your fees"
                                required
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                            <p>Speciality</p>
                            <select
                                onChange={(e) => setSpeciality(e.target.value)}
                                value={speciality}
                                className="border rounded px-3 py-2 outline-none"
                            >
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Education</p>
                            <input
                                onChange={(e) => setDegree(e.target.value)}
                                value={degree}
                                className="border rounded px-3 py-2 outline-none"
                                type="text"
                                placeholder="Education"
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Address</p>
                            <input
                                onChange={(e) => setAddress1(e.target.value)}
                                value={address1}
                                className="border rounded px-3 py-2 outline-none"
                                type="text"
                                placeholder="Address 1"
                                required
                            />
                            <input
                                onChange={(e) => setAddress2(e.target.value)}
                                value={address2}
                                className="border rounded px-3 py-2 outline-none mt-2"
                                type="text"
                                placeholder="Address 2"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="flex-1 flex flex-col gap-1 mt-4 text-gray-600">
                    <p>About me</p>
                    <textarea
                        onChange={(e) => setAbout(e.target.value)}
                        value={about}
                        className="w-full border rounded px-3 py-2 outline-none"
                        placeholder="write about yourself"
                        rows={5}
                        required
                    />
                </div>

                {/* Submit Button with Loading Disabled state */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-10 py-3 mt-8 text-white rounded-full transition-all ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                    }`}
                >
                    {loading ? 'Adding Doctor...' : 'Add doctor'}
                </button>
            </div>
        </form>
    )
}

export default AddDoctor