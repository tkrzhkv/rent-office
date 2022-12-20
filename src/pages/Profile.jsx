import React, { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { ListingItem } from "../components/ListingItem";

export const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [changeDetail, setChangeDetail] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete ?")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListings = listings.filter((listing) => listing.id !== listingId);
      setListings(updatedListings);
      toast.success("Successfully deleted");
    }
  };

  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  return (
    <>
      <section className=' flex justify-center items-center flex-col'>
        <h1 className='text-3xl font-semibold text-center pt-8'>My Profile</h1>
        <div className='lg:w-1/3 md:w-2/4 w-3/4 mx-auto py-12'>
          <form>
            <input
              type='text'
              id='name'
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`w-full px-4 py-2 text-lg text-gray-700 bg-gray-50 border border-gray-300 rounded transition ease-in-out mb-4 shadow-lg ${
                changeDetail && "bg-green-100 focus:bg-green-100"
              }`}
            />
            <input
              type='email'
              id='email'
              value={email}
              disabled
              onChange={onChange}
              className='w-full px-4 py-2 text-lg text-gray-700 bg-gray-50 border border-gray-300 rounded transition ease-in-out shadow-lg'
            />
            <div className='flex justify-between pt-6'>
              <button
                onClick={() => {
                  changeDetail && onSubmit();
                  setChangeDetail((prevState) => !prevState);
                }}
                type='button'
                className='md:text-base text-sm bg-gray-100 border-blue-600 border-2 rounded-2xl p-3 text-black font-semibold py-2 px-2 hover:bg-blue-500 shadow-lg uppercase hover:text-white'
              >
                {changeDetail ? "Apply changes" : "Edit profile"}
              </button>
              <button
                onClick={onLogout}
                type='button'
                className='md:text-base text-sm p-0 bg-gray-100 border-red-600 border-2 rounded-2xl md:p-3 text-black font-semibold py-2 px-2 hover:bg-red-700 shadow-lg uppercase hover:text-white'
              >
                Sign out
              </button>
            </div>
          </form>
          <button
            type='submit'
            className='md:text-base text-sm w-full bg-blue-500 text-white uppercase px-7 py-3 font-medium rounded-2xl mt-8 hover:bg-blue-700 shadow-lg'
          >
            <Link to='/create-listing'>Add office</Link>
          </button>
        </div>
      </section>
      <div className='max-w-6xl px-3 mx-auto'>
        {!loading && listings.length > 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold mb-6'>My Listings</h2>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};
