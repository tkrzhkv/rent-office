import React from "react";
import { FcGoogle } from "react-icons/fc";

export const OAuth = () => {
  return (
    <button className='flex items-center justify-center w-full bg-red-700 px-7 py-3 rounded-md text-white uppercase hover:bg-red-800 active:bg-red-300 shadow-lg transition duration-300 ease-in-out'>
      <FcGoogle className='text-xl mr-2' />
      Continue with Google
    </button>
  );
};
