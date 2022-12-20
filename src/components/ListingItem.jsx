import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { ImLocation } from "react-icons/im";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";

export const ListingItem = ({ listing, id, onEdit, onDelete }) => {
  return (
    <li className='relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]'>
      <Link
        className=' contents'
        to={`/category/${listing.type}/${id}`}
      >
        <img
          className='h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in'
          src={listing.imgUrls[0]}
          alt='office'
          loading='lazy'
        />
        <Moment
          className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg'
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className='w-full p-[10px]'>
          <div className='flex items-center space-x-1'>
            <ImLocation className='h-4 w-4 text-green-600' />
            <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate'>
              {listing.address}
            </p>
          </div>
          <p className='font-semibold m-0 text-xl truncate'>{listing.name}</p>
          <p className='text-[#3667c2] mt-2 font-semibold'>
            $
            {listing.offer
              ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className='flex items-center mt-[10px] space-x-3'>
            <div className='flex items-center space-x-1'>
              <p className='font-bold text-xs'>
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div>
              <p className='font-bold text-xs'>
                {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaRegTrashAlt
          className='absolute bottom-3 right-4 h-[20px] text-red-600 cursor-pointer'
          onClick={() => onDelete(listing.id)}
        />
      )}
      {onEdit && (
        <FaRegEdit
          className='absolute bottom-3 right-14 h-5 w-5 text-green-700 cursor-pointer'
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
};
