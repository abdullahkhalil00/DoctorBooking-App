import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/adminContext';

const AllDoctor = () => {
  const { allDoctors, atoken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  const alterAvaiability = async (doctorId) => {
    changeAvailability(doctorId);
  };

  useEffect(() => {
    if (atoken) {
      getAllDoctors();
    }
  }, [atoken]);

  return (
    <div className="m-5">
      <h1 className="text-lg font-medium text-gray-800">All Doctors</h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {allDoctors && allDoctors.map((item, index) => (
          <div 
            className="border border-indigo-100 rounded-xl max-w-56 overflow-hidden cursor-pointer group bg-white hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-md" 
            key={index}
          >
            {/* Doctor Image Container */}
            <div className="bg-indigo-50 group-hover:bg-indigo-600 transition-all duration-500">
              <img 
                className="w-full h-48 object-cover group-hover:scale-105 transition-all duration-500" 
                src={item.image} 
                alt={item.name} 
              />
            </div>

            {/* Doctor Info Section */}
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
              <p className="text-zinc-600 text-sm mb-3">{item.speciality}</p>

              {/* Availability Status Checkbox */}
              <div className="mt-2 flex items-center gap-2 text-xs">
                <input 
                  onChange={() => alterAvaiability(item._id)}
                  type="checkbox" 
                  checked={item.available} 
                  className="w-3.5 h-3.5 accent-indigo-600 cursor-pointer" 
                />
                <span className={item.available ? "text-green-600 font-medium" : "text-gray-400"}>
                  {item.available ? "Available" : "Not Available"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllDoctor;