import React, { useState } from "react";
import { Link } from "react-router-dom";
import { OAuth } from "../components/OAuth";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-semibold uppercase'>Reset Password</h1>
      <div>
        <div className='lg:w-1/3 md:w-2/4 w-3/4 mx-auto py-12'>
          <form>
            <input
              type='email'
              id='email'
              value={email}
              onChange={onChange}
              placeholder='Email address'
              className='w-full block bg-gray-50 border-gray-200 mb-4  rounded-md shadow-lg'
            />
            <div className='flex flex-col text-center pt-4 text-sm sm:text-base'>
              <p>
                Don't have an account?{" "}
                <Link
                  to='/sign-up'
                  className='text-red-500 hover:text-red-900 transition duration-200 ease-in-out'
                >
                  Sign up
                </Link>
              </p>
              <p>
                <Link
                  className='text-blue-500 hover:text-cyan-500 transition duration-200 ease-in-out'
                  to='/sign-in'
                >
                  Sign in instead
                </Link>
              </p>
            </div>

            <button
              className='uppercase w-full bg-green-400 text-white px-7 p-3 mt-8 rounded-md hover:bg-green-600 active:bg-green-300 shadow-lg transition duration-300 ease-in-out'
              type='submit'
            >
              Send reset password
            </button>
            <div className='my-4 before:border-t flex before:flex-1 items-center after:border-t  after:flex-1  after:border-gray-300'>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};
