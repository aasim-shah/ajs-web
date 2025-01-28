"use client";
import React, { useState } from "react";
import { FaArrowRight, FaThumbtack } from "react-icons/fa6";
import { CiBookmarkMinus } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GoArrowUpRight } from "react-icons/go";
const categories = [
  {
    image: "/images/appstore.png", // replace with your image path
    title: "Email Marketing",
    description: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
  },
  {
    image: "/images/Figma.png",
    title: "Plugin Developer",
     description: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
  },
  {
    image: "/images/Pinterest.png",
    title: "Digital Marketer",
     description: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
  },
  {
    image: "/images/Search.png",
    title: "Product Designer",
     description: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts."
  },
  {
    image: "/images/Slack.png",
    title: "Content Writer",
     description: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts."
  },
  {
    image: "/images/Spotify.png",
    title: "Visual Designer",
     description: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts."
  },
  {
    image: "/images/Telegram.png",
    title: "PHP/JS Developer",
     description: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
  },
  {
    image: "/images/Wordpress.png",
    title: "Data Analyst",
     description: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts."
  },
  // Additional categories
  {
    image: "/images/appstore.png",
    title: "Web Development",
     description: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
  },
  {
    image: "/images/Telegram.png",
    title: "SEO Services",
     description: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts.",
  },
  {
    image: "/images/Spotify.png",
    title: "Podcast Production",
     description: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts."
  },
  {
    image: "/images/Figma.png",
    title: "Data Analyst",
     description: "Join our team as an Email Marketing Specialist and lead our digital outreach efforts."
  },
];

const SimilarJobs = () => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedCategories = showAll ? categories : categories.slice(0, 4);

  return (
    <div className=" mx-5 md:container md:py-24 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="md:text-4xl text-2xl text-blackish">Similar Jobs</h1>
        <button
          onClick={toggleShowAll}
          className="border text-signature text-lg px-4 py-2 rounded-md flex items-center"
        >
          {showAll ? "Show Less" : "View All"} <FaArrowRight className="ml-2" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 py-10 gap-8">
        {displayedCategories.map((category, index) => (
          <div
            key={index}
            className="p-4 bg-background w-full shadow-sm rounded-lg border flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <img
                src={category.image}
                className="w-10 h-10 object-cover  rounded-full"
              />
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-300 mx-4"></div>
              <div className="text-sm text-signature bg-muted p-2 rounded-full">
                Full Time
              </div>
              <div className="">
                <CiBookmarkMinus size={30} className="text-signature" />
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{category.title}</h3>
            </div>
           
            <div className="flex items-center  text-signature">
              
                <Link
                  className=" px-0 text-sm py-2 rounded-md"
                  href="/moredetails"
                >
                  More Details
                </Link>
                <GoArrowUpRight size={20} className="ml-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarJobs;
