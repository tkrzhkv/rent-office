import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css/bundle";
import { RiShareBoxLine } from "react-icons/ri";
import { ImLocation } from "react-icons/im";
import { FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { Contact } from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export const Listing = () => {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactOwner, setContactOwner] = useState(false);

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect='fade'
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className='relative mx-auto w-[100%] overflow-hidden h-[400px]'
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className='fixed top-[13%] right-[8%] z-10 cursor-pointer bg-white border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center hover:scale-110 hover:border-black hover:shadow-xl'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          console.log(navigator);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <RiShareBoxLine className='text-lg text-slate-500 hover:text-black' />
      </div>
      {shareLinkCopied && (
        <p className='fixed top-[20%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2'>
          Link copied
        </p>
      )}
      <div className='flex flex-col md:flex-row max-w-6xl lg:mx-auto m-4 p-4 rounded-lg border-3 shadow-lg lg:space-x-5'>
        <div className='w-full'>
          <p className='text-2xl font-bold p-3 text-blue-900'>
            {listing.name} - ${" "}
            {listing.offer
              ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " / months" : ""}
          </p>
          <p className='flex items-center  mb-4 font-semibold px-3'>
            <ImLocation className='text-green-700 mr-1' />
            {listing.address}
          </p>
          <div className='flex space-x-2 px-4 items-center w-[75%]'>
            <p className='bg-red-800 w-full rounded-lg max-w-[200px] p-1 text-white text-center font-semibold shadow-lg text-xs sm:text-base'>
              {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            {listing.offer && (
              <p className='w-full max-w-[200px] bg-green-800 rounded-lg text-white text-center p-1 font-semibold shadow-lg text-xs sm:text-base'>
                ${listing.regularPrice - listing.discountedPrice} discount
              </p>
            )}
          </div>
          <p className='mt-3 mb-3 px-4'>
            <span className='font-bold'>Description - </span>
            {listing.description}
          </p>
          <ul className='sm:flex items-center ml-4 justify-between lg:space-x-10 text-sm font-semibold mb-6'>
            <li className='flex items-center whitespace-nowrap'>
              <FaBed className='text-lg mr-1' />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className='flex items-center whitespace-nowrap'>
              <FaBath className='text-lg mr-1' />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className='flex items-center whitespace-nowrap'>
              <FaParking className='text-lg mr-1' />
              {listing.parking > 1 ? "Parking spot" : "No parking"}
            </li>
            <li className='flex items-center whitespace-nowrap'>
              <FaChair className='text-lg mr-1' />
              {listing.furnished > 1 ? "Furnished" : "Not furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactOwner && (
            <div className='mt-6'>
              <button
                onClick={() => setContactOwner(true)}
                className='px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out'
              >
                Contact Owner
              </button>
            </div>
          )}
          {contactOwner && (
            <Contact
              userRef={listing.userRef}
              listing={listing}
            />
          )}
        </div>
        <div className=' w-full h-[200px] md:h-[400px] z-10 overflow-hidden mt-6 md:mt-0 md:ml-2 border-2 border-gray-400 rounded'>
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
              <Popup>{listing.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
};
