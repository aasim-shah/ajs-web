import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoGlobeOutline } from "react-icons/io5";
import { MdLocationOn } from "react-icons/md";
import Tag from "./Tag";

const CompanyCardSm = ({ company }: any) => {
  const {
    _id,
    companyName,
    companyLogo,
    description,
    services,
    city,
    country,
    province,
    website,
  } = company;

  return (
    <div className="flex justify-between items-start">
      <div className="flex">
        {/* Company Logo */}
        {companyLogo ? (
          <div
            style={{
              width: "61px",
              height: "61px",
              position: "relative",
              borderRadius: "50%",
              overflow: "hidden",
              marginRight: "16px",
            }}
          >
            <Image
              src={companyLogo}
              alt={companyName || "Company Logo"}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ) : (
          <div
            style={{
              width: "61px",
              height: "61px",
              backgroundColor: "#ccc",
              borderRadius: "50%",
              display: "inline-block",
              marginRight: "16px",
            }}
          />
        )}

        {/* Company Details */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold">{companyName}</h3>
          <p className="text-sm text-gray-500">
            <MdLocationOn className="inline mr-1" />
            {city}, {province}, {country}
          </p>
          <p className="text-xs mt-1">{description}</p>

          {/* Services */}
          <div className="flex items-center gap-2 mt-2">
            {services.slice(0, 2).map((service: string, index: number) => (
              <Tag key={index} value={service} />
            ))}
            {services.length > 2 && (
              <span className="text-xs text-gray-500">
                + {services.length - 2} more
              </span>
            )}
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
          <IoGlobeOutline size={24} />
        </Link>
      )}
    </div>
  );
};

export default CompanyCardSm;
