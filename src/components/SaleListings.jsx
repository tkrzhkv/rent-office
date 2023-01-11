import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListingItem } from "../components/ListingItem";
import { db } from "../firebase";

export const SaleListings = () => {
  const [saleListings, setSaleListings] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        // get reference
        const listingsRef = collection(db, "listings");
        // create the query
        const q = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        // execute the query
        const querySnap = await getDocs(q);
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setSaleListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);

  return (
    <div>
      <div className='max-w-6xl mx-auto pt-4 space-y-6'>
        {saleListings && saleListings.length > 0 && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>Place for sale</h2>
            <Link to='/category/rent'>
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>
                Show more places for sale
              </p>
            </Link>
            <ul
              className={
                saleListings.length < 4
                  ? "sm:grid sm:grid-cols-2 lg:grid-cols-3"
                  : "sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              }
            >
              {saleListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
