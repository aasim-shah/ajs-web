import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaApple } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import GooglePlayIcon from "../../../../../public/images/newicons/googleplay.svg"; // Import the Google Play SVG

const EmpowerJob = () => {
  return (
    <div className=" container pb-24">
      <div className="bg-darkGrey flex md:flex-row flex-col items-center md:px-16 px-5 py-10 md:rounded-[30px]">
        <div className="text-background flex flex-col md:w-1/2">
          <div className="mb-6">
            <h1 className="lg:text-5xl md:text-4xl text-3xl">
              Empower Your Job Search with{" "}
              <span className="text-signature">Asia Job Swipe</span>
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center md:text-xl text-lg gap-2">
              <GiCheckMark size={20} />
              <span>Discover Your Perfect Job</span>
            </div>
            <div className="flex items-center gap-2">
              <GiCheckMark size={20} />
              <span>Apply With Ease</span>
            </div>
            <div className="flex items-center gap-2">
              <GiCheckMark size={20} />
              <span>Get Hired Faster</span>
            </div>
          </div>
          <div className="mt-6">
            <div>
              <h1 className="font-bold lg:text-xl md:text-xl text-lg mb-4">
                Get the App
              </h1>
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex">
                <div className="flex items-center px-4 py-2 text-foreground rounded-lg bg-background gap-4  md:flex-2">
                  <div className="flex-shrink-0">
                    <Link href="https://play.google.com/store">
                      <GooglePlayIcon   />
                    </Link>
                  </div>
                  <div>
                    <p className="text-xs">GET IT ON</p>
                    <h1 className="lg:text-xl md:text-lg text-base">Google Play</h1>
                  </div>
                </div>
                </div>
                
              <div className="flex">
              <div className="flex items-center px-4 py-2 text-foreground rounded-lg bg-background gap-4 md:flex-2">
                  <div className="flex-shrink-0">
                    <Link href="https://www.apple.com/app-store/">
                      <FaApple className="w-12 h-12 text-foreground" />
                    </Link>
                  </div>
                  <div>
                    <p className="text-xs">GET ON THE</p>
                    <h1 className="lg:text-xl md:text-lg text-base">App Store</h1>
                  </div>
                </div>
              </div>
              
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 flex items-center justify-center">
          <Image
            src="/images/iphone.png"
            width={524}
            height={473}
            alt="iphone 15"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default EmpowerJob;
