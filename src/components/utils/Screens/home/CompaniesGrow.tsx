import React from 'react';
import { SiAdobe } from "react-icons/si";
import { FaPaypal, FaSlack, FaGoogle, FaAmazon } from "react-icons/fa";
import { IoLogoMicrosoft } from "react-icons/io5";

const CompaniesGrow = () => {
  return (
    <div className="   container py-16">
      <div className="flex justify-center md:justify-start pb-10 text-lg">
        <h1>Companies we helped grow</h1>
      </div>
      <div className="flex sm:justify-center   flex-wrap md:flex-nowrap text-newGrey ">
        <div className="flex gap-1 items-center md:w-1/6 ">
          <SiAdobe size={30} /> Adobe
        </div>
        <div className="flex ml-1  gap-1 items-center md:w-1/6 ">
          <FaPaypal size={30} /> Paypal
        </div>
        <div className="flex ml-1 gap-1 items-center md:w-1/6 ">
          <FaSlack size={30}/> Slack
        </div>
        <div className="flex ml-1 gap-1 items-center md:w-1/6 ">
          <FaGoogle size={30} /> Google
        </div>
        <div className="flex ml-1 gap-1 items-center md:w-1/6 ">
          <FaAmazon size={30} /> Amazon
        </div>
        <div className="flex  gap-1 items-center md:w-1/6 ">
          <IoLogoMicrosoft size={30} /> Microsoft
        </div>
      </div>
    </div>
  );
}

export default CompaniesGrow;
