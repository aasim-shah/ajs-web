"use client";
import React, { useState } from "react";
import { CiPen } from "react-icons/ci";
import { FaArrowRight, FaCode } from "react-icons/fa6";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { PiVideoBold } from "react-icons/pi";
import { VscMusic } from "react-icons/vsc";
import { IoBarChartOutline } from "react-icons/io5";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { FiDatabase } from "react-icons/fi";
import { PiPenNibBold } from "react-icons/pi";

const categories = [
  {
    icon: <PiPenNibBold  size={30}  />,
    title: "Graphics & Design",
    description: "120 open positions"
  },
  {
    icon: <FaCode size={30}  />,
    title: "Code & Programming",
    description: "150 open positions"
  },
  {
    icon: <HiOutlineSpeakerphone size={30}  />,
    title: "Digital Marketing",
    description: "200 open positions"
  },
  {
    icon: <PiVideoBold size={30}  />,
    title: "Video & Animation",
    description: "80 open positions"
  },
  {
    icon: <VscMusic size={30}  />,
    title: "Music & Audio",
    description: "90 open positions"
  },
  {
    icon: <IoBarChartOutline size={30}  />,
    title: "Account & Finance",
    description: "60 open positions"
  },
  {
    icon: <MdOutlineHealthAndSafety size={30}  />,
    title: "Health & Care",
    description: "110 open positions"
  },
  {
    icon: <FiDatabase size={30}  />,
    title: "Data & Science",
    description: "75 open positions"
  },
  // Additional categories
  {
    icon: <FaCode size={30}  />,
    title: "Web Development",
    description: "300 open positions"
  },
  {
    icon: <HiOutlineSpeakerphone size={30}  />,
    title: "SEO Services",
    description: "250 open positions"
  },
  {
    icon: <VscMusic size={30}  />,
    title: "Podcast Production",
    description: "45 open positions"
  },
  {
    icon: <IoBarChartOutline size={30}  />,
    title: "Market Research",
    description: "95 open positions"
  }
];

const PopulatCategory = () => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedCategories = showAll ? categories : categories.slice(0, 8);

  return (
    <div className="   container  md:py-24 py-10">
      <div className="flex justify-between items-center px-5 mb-6">
        <h1 className="md:text-4xl text-2xl text-blackish">Popular category</h1>
        <i className="fi fi-rr-home"></i>
        <button
          onClick={toggleShowAll}
          className="border  text-signature text-lg px-4 py-2 rounded-md flex items-center"
        >
          {showAll ? "Show Less" : "View All"} <FaArrowRight className="ml-3" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-5 py-10 gap-4">
        {displayedCategories.map((category, index) => (
          <div key={index} className="lg:p-4 p-2 bg-background w-full shadow-sm rounded-lg flex justify-center items-center">
            <div className="mr-4 bg-muted text-signature hover:bg-signature hover:text-background rounded-lg p-5">
              {category.icon}
            </div>
            <div className="w-full text-blackish">
              <h3 className="text-base font-semibold">{category.title}</h3>
              <p className="text-sm text-darktext">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopulatCategory;
