import React from "react";
import { Slider } from "../components/Slider";
import { OfferListings } from "../components/OfferListings";
import { RentListings } from "../components/RentListings";
import { SaleListings } from "../components/SaleListings";

export const Home = () => {
  return (
    <div>
      <Slider />
      <OfferListings />
      <RentListings />
      <SaleListings />
    </div>
  );
};
