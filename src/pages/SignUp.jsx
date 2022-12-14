import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { OAuth } from "../components/OAuth";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Sign up was successful");
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong with login or password");
    }
  };

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-semibold uppercase'>Sign Up</h1>
      <div>
        <div className='lg:w-1/3 md:w-2/4 w-3/4 mx-auto py-12'>
          <form onSubmit={onSubmit}>
            <input
              type='text'
              id='name'
              value={name}
              onChange={onChange}
              placeholder='Full name'
              className='w-full block bg-gray-50 border-gray-200 mb-4  rounded-md shadow-lg'
            />
            <input
              type='email'
              id='email'
              value={email}
              onChange={onChange}
              placeholder='Email address'
              className='w-full block bg-gray-50 border-gray-200 mb-4  rounded-md shadow-lg'
            />
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                id='password'
                value={password}
                onChange={onChange}
                placeholder='Password'
                className='w-full block bg-gray-50 border-gray-200  rounded-md shadow-lg mb-4'
              />
              <div
                className='absolute right-3 top-3 text-xl cursor-pointer text-gray-600 selection:bg-transparent'
                onClick={() => setShowPassword((prevState) => !prevState)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </div>
            </div>
            <div className='flex flex-col text-center pt-4 text-sm sm:text-base'>
              <p>
                Have an account?{" "}
                <Link
                  to='/sign-in'
                  className='text-red-500 hover:text-red-900 transition duration-200 ease-in-out'
                >
                  Sign in
                </Link>
              </p>
              <p>
                <Link
                  className='text-blue-500 hover:text-cyan-500 transition duration-200 ease-in-out'
                  to='/forgot-password'
                >
                  Forgot password?
                </Link>
              </p>
            </div>

            <button
              className='uppercase w-full bg-green-400 text-white px-7 p-3 mt-8 rounded-md hover:bg-green-600 active:bg-green-300 shadow-lg transition duration-300 ease-in-out'
              type='submit'
            >
              Sign up
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
