import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../context/adminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/doctorContext'
const Login = () => {
    // 'Doctor' ya 'Admin' login toggle karne ke liye state
    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setatoken, backendUrl } = useContext(AdminContext)
    const {setdoctortoken, doctortoken} = useContext(DoctorContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            if (state === 'Admin') {
                const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })

                if (data.success) {
                    localStorage.setItem('atoken', data.token)
                    setatoken(data.token)
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
                if (data.success) {
                    localStorage.setItem('doctortoken', data.doctortoken)
                    setdoctortoken(data.doctortoken)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            // Backend se aane wale error message ko toast me dikhane ke liye:
            toast.error(error.response?.data?.message || error.message)
        }
    }
    useEffect(() => {
        console.log(doctortoken)
    },[doctortoken])

    return (
        <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center justify-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">

                <p className="text-2xl font-semibold text-gray-800">
                    <span className="text-indigo-600">{state}</span> Login
                </p>
                <p className="text-gray-500">
                    Please log in to manage appointments and dashboard
                </p>

                <div className="w-full">
                    <p>Email</p>
                    <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1 outline-none"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                </div>

                <div className="w-full">
                    <p>Password</p>
                    <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1 outline-none"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                </div>

                <button className="bg-indigo-600 text-white w-full py-2 rounded-md text-base mt-2 hover:bg-indigo-700 transition-all">
                    Login
                </button>

                {/* Doctor aur Admin switch karne ke liye link */}
                {state === 'Doctor' ? (
                    <p className="mt-1">
                        Admin Login?{' '}
                        <span
                            onClick={() => setState('Admin')}
                            className="text-indigo-600 underline cursor-pointer font-medium"
                        >
                            Click here
                        </span>
                    </p>
                ) : (
                    <p className="mt-1">
                        Doctor Login?{' '}
                        <span
                            onClick={() => setState('Doctor')}
                            className="text-indigo-600 underline cursor-pointer font-medium"
                        >
                            Click here
                        </span>
                    </p>
                )}

            </div>
        </form>
    )
}

export default Login