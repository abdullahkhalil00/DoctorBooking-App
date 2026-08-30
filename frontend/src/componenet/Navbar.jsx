import React, { useState, useContext } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useEffect } from 'react'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [token, setToken] = useState(true)
  const { userToken, setUserToken , image, imageURL, setImage  } = useContext(AppContext)
  
  const logOut = async () => {
    setUserToken(false)
    localStorage.removeItem('token')
    setShowProfileMenu(false)
  }
 
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-300 relative'>
      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        className='w-36 sm:w-44 cursor-pointer'
        src={assets.logo}
        alt="logo"
      />

      {/* Desktop Navigation Links */}
      <ul className='hidden md:flex items-start gap-8 font-medium uppercase text-xs tracking-wider'>
        <NavLink to='/' className='flex flex-col items-center gap-1 py-1'>
          {({ isActive }) => (
            <>
              <li className='cursor-pointer text-gray-800 hover:text-black'>Home</li>
              <hr className={`w-3/5 border-none h-0.5 bg-indigo-600 transition-all ${isActive ? 'block' : 'hidden'}`} />
            </>
          )}
        </NavLink>

        <NavLink to='/doctors' className='flex flex-col items-center gap-1 py-1'>
          {({ isActive }) => (
            <>
              <li className='cursor-pointer text-gray-800 hover:text-black'>All Doctors</li>
              <hr className={`w-3/5 border-none h-0.5 bg-indigo-600 transition-all ${isActive ? 'block' : 'hidden'}`} />
            </>
          )}
        </NavLink>

        <NavLink to='/about' className='flex flex-col items-center gap-1 py-1'>
          {({ isActive }) => (
            <>
              <li className='cursor-pointer text-gray-800 hover:text-black'>About</li>
              <hr className={`w-3/5 border-none h-0.5 bg-indigo-600 transition-all ${isActive ? 'block' : 'hidden'}`} />
            </>
          )}
        </NavLink>

        <NavLink to='/contact' className='flex flex-col items-center gap-1 py-1'>
          {({ isActive }) => (
            <>
              <li className='cursor-pointer text-gray-800 hover:text-black'>Contact</li>
              <hr className={`w-3/5 border-none h-0.5 bg-indigo-600 transition-all ${isActive ? 'block' : 'hidden'}`} />
            </>
          )}
        </NavLink>
      </ul>

      {/* Action Area / Profile Menu & Mobile Toggle */}
      <div className='flex items-center gap-4'>
        {userToken ? (
          <div 
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
            onClick={() => setShowProfileMenu(prev => !prev)}
            className='flex items-center gap-2 cursor-pointer relative'
          >
            <img className='w-8 rounded-full' src={imageURL ? imageURL : 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png'} alt="profile" />
            <img className='w-2.5' src={assets.dropdown_icon} alt="dropdown" />

            {/* Profile Dropdown Menu */}
            <div className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 ${showProfileMenu ? 'block' : 'hidden'}`}>
              <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-md'>
                <p 
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate('/my-profile')
                    setShowProfileMenu(false)
                  }} 
                  className='hover:text-black cursor-pointer'
                >
                  My Profile
                </p>
                <p 
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate('/my-appointments')
                    setShowProfileMenu(false)
                  }} 
                  className='hover:text-black cursor-pointer'
                >
                  My Appointments
                </p>
                <p 
                  onClick={(e) => {
                    e.stopPropagation()
                    logOut()
                  }} 
                  className='hover:text-black cursor-pointer'
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              navigate('/login')
              setToken(true)
            }}
            className='bg-indigo-600 text-white px-8 py-3 rounded-full font-light transition-all duration-300 hover:scale-105 hidden md:block'
          >
            Create account
          </button>
        )}

        {/* Mobile Navigation Drawer Toggle */}
        <img
          onClick={() => setShowMenu(true)}
          className='w-6 md:hidden cursor-pointer'
          src={assets.menu_icon}
          alt="menu"
        />

        {/* Mobile Slide-Over Drawer */}
        <div
          className={`fixed top-0 right-0 bottom-0 z-30 bg-white transition-all duration-300 overflow-hidden ${
            showMenu ? 'w-full' : 'w-0'
          } md:hidden`}
        >
          <div className='flex items-center justify-between px-5 py-6 border-b border-gray-200'>
            <img className='w-36' src={assets.logo} alt="logo" />
            <img
              onClick={() => setShowMenu(false)}
              className='w-7 cursor-pointer'
              src={assets.cross_icon}
              alt="close"
            />
          </div>

          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium text-gray-800'>
            <NavLink
              to='/'
              onClick={() => setShowMenu(false)}
              className='px-4 py-2 rounded inline-block w-full text-center hover:bg-gray-100'
            >
              Home
            </NavLink>
            <NavLink
              to='/doctors'
              onClick={() => setShowMenu(false)}
              className='px-4 py-2 rounded inline-block w-full text-center hover:bg-gray-100'
            >
              All Doctors
            </NavLink>
            <NavLink
              to='/about'
              onClick={() => setShowMenu(false)}
              className='px-4 py-2 rounded inline-block w-full text-center hover:bg-gray-100'
            >
              About
            </NavLink>
            <NavLink
              to='/contact'
              onClick={() => setShowMenu(false)}
              className='px-4 py-2 rounded inline-block w-full text-center hover:bg-gray-100'
            >
              Contact
            </NavLink>

            {!token && (
              <button
                onClick={() => {
                  setShowMenu(false)
                  navigate('/login')
                  setToken(true)
                }}
                className='w-full bg-indigo-600 text-white py-3 rounded-full mt-4 font-light'
              >
                Create account
              </button>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar