import React, { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Login = () => {
  const { userToken, setUserToken, backendUrl } = useContext(AppContext)
  const [state, setState] = useState('Sign Up')
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      if (state === 'Sign Up') {
        // Pass payload object as second argument to axios.post
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        })
        console.log(data)
        console.log(data.userToken)
        if (data.success) {
          localStorage.setItem('token', data.userToken)
          setUserToken(data.token)
          toast.success(data.message)
          setEmail('')
          setName('')
          setPassword('')
        } else {
          toast.error(data.message)
        }
      } else {
        // Login API Call
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setUserToken(data.token)
          toast.success(data.message)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }
useEffect(() =>{
  if(userToken){
    navigate('/')
  }
},[userToken])
  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold text-gray-800'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>
        <p className='text-gray-500'>
          Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment
        </p>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1 outline-none focus:border-primary'
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1 outline-none focus:border-primary'
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1 outline-none focus:border-primary'
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type='submit'
          className='bg-[#5F6FFF] text-white w-full py-2.5 rounded-md text-base mt-2 hover:bg-blue-600 transition-all duration-200'
        >
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </button>

        {state === 'Sign Up' ? (
          <p className='mt-2'>
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className='text-[#5F6FFF] underline cursor-pointer font-medium'
            >
              Login here
            </span>
          </p>
        ) : (
          <p className='mt-2'>
            Create a new account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className='text-[#5F6FFF] underline cursor-pointer font-medium'
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