 
import Link from "next/link";
import React from "react";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaApple } from "react-icons/fa";
import GooglePlayIcon from "../../../../public/images/newicons/googleplay.svg";

const Footer = () => {
  return (
    <div className="bg-muted pt-16">
      <div className=" container   flex flex-wrap justify-between">
        {/* Column 1: Logo and Social Media */}
        <div className="mb-8 md:mb-0 w-full md:w-2/5">
          <div>
            <span className="text-signature md:text-6xl text-2xl font-bold">
              <Link href="/">
                Asia <span className="text-darkBlue">Job</span>Swipe
              </Link>
            </span>
          </div>
          <div className="py-5 text-darkGrey md:w-96 w-full ">
            <p>
              Find your next career opportunity and connect with like-minded
              individuals. Find your next career opportunity and connect with
              like-minded individuals.
            </p>
          </div>
          <div className="flex space-x-4">
            <FaFacebookF className="text-signature" size={25} />
            <div className="border-x border-darkGrey px-5">
              <FaLinkedinIn className="text-signature" size={25} />
            </div>
            <FaTwitter className="text-signature" size={25} />
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="mb-8 md:mb-0 sm:w-1/2 md:w-1/3  lg:w-1/5">
          <h1 className="font-bold md:text-2xl text-lg mb-4">Quick Links</h1>
          <ul className="space-y-1 md:text-xl text-md flex flex-col gap-3 text-darkGrey">
            <li>
              <Link href="/about">Search Jobs</Link>
            </li>
            <li>
              <Link href="/services">Featured Jobs</Link>
            </li>
            <li>
              <Link href="/careers">Top Companies</Link>
            </li>
            <li>
              <Link href="/blog">Download App</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Help Links */}
        <div className="mb-8 md:mb-0 md:mt-5 lg:mt-0 sm:w-1/2 lg:w-1/5">
          <h1 className="font-bold md:text-2xl text-xl mb-4">Help Links</h1>
          <ul className="space-y-1 md:text-xl text-md flex flex-col gap-3 text-darkGrey">
            <li>
              <Link href="/faq">About Us</Link>
            </li>
            <li>
              <Link href="/support">Services</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms & Condition</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Get Our App */}
        <div className="mb-8 md:mb-0 sm:w-full md:w-1/3 lg:w-1/5">
          <h1 className="font-bold md:text-2xl text-lg mb-4">
            Get Our App Now!
          </h1>
          <div className="flex md:mt-5 flex-col gap-3">
            <div className="flex items-center p-2 text-background rounded-lg gap-3 bg-darkGrey w-full md:w-[200px]">
              <Link href="https://play.google.com/store">
                <GooglePlayIcon />
              </Link>
              <div>
                <p className="text-xs">GET IT ON</p>
                <h1 className="lg:text-2xl md:text-xl text-base">Google Play</h1>
              </div>
            </div>

            <div className="flex items-center mt-5 p-2 text-background rounded-lg gap-3 bg-darkGrey w-full md:w-[200px]">
              <Link href="https://www.apple.com/app-store/">
                <FaApple size={35} className="text-background" />
              </Link>
              <div>
                <p className="text-xs">GET ON THE</p>
                <h1 className="lg:text-2xl md:text-xl text-base">App Store</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-5 md:container">
        <div className="py-5">
          <hr className="border-darkGrey" />
        </div>
        <div className="flex pb-5 flex-col justify-center items-center">
          <h1>All rights reserved. Copyright &copy; Asia Job Swipe</h1>
        </div>
      </div>
    </div>
  );
};

export default Footer;
