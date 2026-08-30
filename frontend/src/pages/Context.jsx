import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Contact = () => {
  return (
    <div>
      {/* ----- Header Section ----- */}
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      {/* ----- Contact Content Container ----- */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm max-w-6xl mx-auto px-4'>
        {/* Left Image */}
        <img className='w-full md:max-w-[360px] rounded-lg object-cover' src={assets.contact_image} alt="Contact Us" />

        {/* Right Details */}
        <div className='flex flex-col justify-center items-start gap-6 text-gray-600'>
          <p className='font-semibold text-lg text-gray-700'>OUR OFFICE</p>
          <p className='text-gray-500 leading-relaxed'>
            54709 Willms Station <br />
            Suite 350, Washington, USA
          </p>
          <p className='text-gray-500'>
            Tel: (92) 370‑6168427 <br />
            Email: hafizabdullahpu@@gmail.com
          </p>
          <p className='font-semibold text-lg text-gray-700 mt-2'>CAREERS AT PRESCRIPTO</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          
          {/* Explore Jobs Button with Hover Effect */}
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 rounded-sm mt-2'>
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact