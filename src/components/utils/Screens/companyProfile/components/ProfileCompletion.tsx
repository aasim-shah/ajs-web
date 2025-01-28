import React from "react";
import Image from "next/image";
import { FaGripfire, FaUsers } from "react-icons/fa";
import { TbBuildingSkyscraper } from "react-icons/tb";
import Link from "next/link";

interface ProfileCompletionProps {
  company: {
    companyName: string;
    companyLogo?: string; // Make companyLogo optional
    website?: string; // website is optional
    foundedYear: string;
    numberOfEmployees: string;
    sector: string;
  };
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ company }) => {
  const {
    companyName,
    companyLogo,
    website,
    foundedYear,
    numberOfEmployees,
    sector,
  } = company;

  // Define the default placeholder image path
  const placeholderImage = "/images/placeholderimage.png";

  return (
    <div className="border rounded-[20px] relative">
      {/* Desktop layout */}
      <div className="hidden md:flex gap-4 items-center rounded-tr-[20px] rounded-tl-[20px] bg-gradient-to-tr from-signature to-blue/20 p-5 relative">
        <div className="w-1/3 md:relative">
          <div className="md:absolute border-8 rounded-full border-background md:left-[40px] md:top-[10px] w-24 h-24 md:w-36 md:h-36 overflow-hidden">
            <Image
              src={companyLogo || placeholderImage} // Use placeholder image if companyLogo is not available
              alt="profile"
              width={150}
              height={150}
              className="rounded-full object-cover w-24 md:w-36 h-24 md:h-36"
            />
          </div>
        </div>
        <div className="md:w-2/3 w-full md:py-10">
          <h1 className="md:text-3xl text-xl text-modaltext">{companyName}</h1>
          {website && (
            <p className="md:text-xl text-md text-signininput4 py-2">
              <Link
                href={website}
                className="text-signature hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {website}
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex flex-col items-center bg-gradient-to-tr from-signature to-blue/20 p-5 rounded-t-[20px]">
        <div className="w-full flex justify-center">
          <div className="border-4 rounded-full border-background w-24 h-24 overflow-hidden">
            <Image
              src={companyLogo || placeholderImage} // Use placeholder image if companyLogo is not available
              alt="profile"
              width={96}
              height={96}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
        </div>
        <div className="w-full text-center mt-4">
          <h1 className="text-2xl text-modaltext">{companyName}</h1>
          {website && (
            <p className="text-md text-signininput4 py-2">
              <Link
                href={website}
                className="text-signature hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {website}
              </Link>
            </p>
          )}
        </div>
      </div>

      <div className="px-5 md:px-7 py-10 mt-10">
        <div className="flex flex-col md:flex-row justify-around">
          <div className="flex items-center gap-3 mt-3 md:mt-0">
            <FaGripfire className="text-signature" size={30} />
            <div className="text-center md:text-left">
              <h1 className="text-signininput text-md md:text-xl">Founded</h1>
              <p className="text-sm md:text-base">
                {new Date(foundedYear).getFullYear()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 md:mt-0">
            <FaUsers className="text-signature" size={30} />
            <div className="text-center md:text-left">
              <h1 className="text-signininput text-md md:text-xl">Employees</h1>
              <p className="text-sm md:text-base">{numberOfEmployees}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 md:mt-0">
            <TbBuildingSkyscraper className="text-signature" size={30} />
            <div className="text-center md:text-left">
              <h1 className="text-signininput text-md md:text-xl">Industry</h1>
              <p className="text-sm md:text-base">{sector}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
