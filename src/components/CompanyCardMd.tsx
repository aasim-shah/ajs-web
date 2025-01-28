import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoGlobeOutline } from "react-icons/io5";
import { MdLocationOn } from "react-icons/md";
import Tag from "./Tag";

const CompanyCardMd = ({ company }: any) => {
  const {
    _id,
    companyName,
    companyLogo,
    description,
    services,
    city,
    country,
    province,
    sector,
    numberOfEmployees,
    totalJobs,
    website,
  } = company;

  return (
    <div className="flex justify-between items-start">
      <div className="flex">
        {/* Company Logo */}
        {companyLogo ? (
          <div className="w-20 h-20 relative rounded-full overflow-hidden mr-4 flex-shrink-0">
            <Image
              src={companyLogo}
              alt={`${companyName} Logo`}
              width={80}
              height={80}
              objectFit="cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full mr-4 flex-shrink-0"></div>
        )}

        {/* Company Details */}
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">{companyName}</h3>
          <p className="text-sm text-gray-500">
            {sector} • Employees: {numberOfEmployees} • Jobs: {totalJobs}
          </p>
          <p className="text-sm text-gray-500">
            <MdLocationOn className="inline mr-1" />
            {city}, {province}, {country}
          </p>
          <p className="text-sm mt-1">{description}</p>

          {/* Services */}
          <div className="flex items-center gap-2 mt-3">
            {services.map((service: string, index: number) => (
              <Tag key={index} value={service} />
            ))}
          </div>

          {/* View More Button */}
          <div className="mt-3">
            <Link href={`/company/${_id}`}>
              <Button variant="outline" className="w-full">
                View More
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Website Link */}
      {website && (
        <Link
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-signature"
        >
          <IoGlobeOutline size={28} />
        </Link>
      )}
    </div>
  );
};

export default CompanyCardMd;
