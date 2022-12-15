import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };
  return (
    <>
      <section className=' flex justify-center items-center flex-col'>
        <h1 className='text-3xl font-semibold text-center pt-8'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            <input
              type='text'
              id='name'
              value={name}
              disabled
              className='w-full px-4 py-2 text-xl text-gray-700 bg-gray-50 border border-gray-300 rounded transition ease-in-out mb-4'
            />
            <input
              type='email'
              id='email'
              value={email}
              disabled
              className='w-full px-4 py-2 text-xl text-gray-700 bg-gray-50 border border-gray-300 rounded transition ease-in-out'
            />
            <div className='flex justify-between pt-6'>
              <button
                type='button'
                className='bg-blue-500 rounded-md p-3 text-white'
              >
                Edit profile
              </button>
              <button
                onClick={onLogout}
                type='button'
                className='bg-red-700 rounded-md p-3 text-white'
              >
                Sign out
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
