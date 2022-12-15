import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //update displayName in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        //update name in firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Could not update profile details");
    }
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
              disabled={!changeDetail}
              onChange={onChange}
              className={`w-full px-4 py-2 text-xl text-gray-700 bg-gray-50 border border-gray-300 rounded transition ease-in-out mb-4 ${
                changeDetail && "bg-green-100 focus:bg-green-100"
              }`}
            />
            <input
              type='email'
              id='email'
              value={email}
              disabled={!changeDetail}
              onChange={onChange}
              className={`w-full px-4 py-2 text-xl text-gray-700 bg-gray-50 border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-green-100 focus:bg-green-100"
              }`}
            />
            <div className='flex justify-between pt-6'>
              <button
                onClick={() => {
                  changeDetail && onSubmit();
                  setChangeDetail((prevState) => !prevState);
                }}
                type='button'
                className='bg-blue-500 rounded-md p-3 text-white'
              >
                {changeDetail ? "Apply changes" : "Edit profile"}
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
