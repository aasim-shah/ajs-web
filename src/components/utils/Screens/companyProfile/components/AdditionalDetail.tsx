import React from "react";
import { MdOutlineMailOutline, MdPhoneAndroid } from "react-icons/md";
import { TbLanguage, TbMapPin } from "react-icons/tb";

interface Contact {
  phone: string;
  isVerified: boolean;
}

interface UserInfo {
  contact: Contact;
  email: string;
  role: string;
}

interface AdditionalDetailProps {
  userInfo?: UserInfo;
  languages: string[];
  city: string;
  province: string;
  country: string;
  address: string;
}

const AdditionalDetail: React.FC<AdditionalDetailProps> = ({
  userInfo,
  languages,
  city,
  province,
  country,
  address,
}) => {
  const email = userInfo?.email || "email@example.com";
  const phone = userInfo?.contact?.phone || "123-456-7890";
  const languagesList =
    languages.length > 0 ? languages.join(", ") : "Languages";

  return (
    <div className="border rounded-[20px] py-6 px-5">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="flex justify-between">
          <h1 className="text-modaltext text-2xl">Additional Details</h1>
        </div>
        <div className="py-6">
          <div className="flex gap-5 items-center">
            <MdOutlineMailOutline className="text-signininput4" size={30} />
            <div>
              <h1 className="text-lg text-signininput4">Email</h1>
              <p className="text-lg text-modaltext">{email}</p>
            </div>
          </div>
          <div className="py-6 flex gap-5 items-center">
            <MdPhoneAndroid className="text-signininput4" size={30} />
            <div>
              <h1 className="text-lg text-signininput4">Phone</h1>
              <p className="text-lg text-modaltext">{phone}</p>
            </div>
          </div>
          <div className="py-2 flex gap-5 items-center">
            <TbMapPin className="text-signininput4" size={30} />
            <div>
              <h1 className="text-lg text-signininput4">Location</h1>
              <p className="text-lg text-modaltext">{`${address}, ${city}, ${province}, ${country}`}</p>
            </div>
          </div>
          <div className="py-6 flex gap-5 items-center">
            <TbLanguage className="text-signininput4" size={30} />
            <div>
              <h1 className="text-lg text-signininput4">Languages</h1>
              <p className="text-lg text-modaltext">{languagesList}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex justify-between">
          <h1 className="text-modaltext text-xl">Additional Details</h1>
        </div>
        <div className="py-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <MdOutlineMailOutline className="text-signininput4" size={24} />
              <div>
                <h1 className="text-base text-signininput4">Email</h1>
                <p className="text-base text-modaltext">{email}</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <MdPhoneAndroid className="text-signininput4" size={24} />
              <div>
                <h1 className="text-base text-signininput4">Phone</h1>
                <p className="text-base text-modaltext">{phone}</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <TbMapPin className="text-signininput4" size={30} />
              <div>
                <h1 className="text-base text-signininput4">Location</h1>
                <p className="text-base text-modaltext">{`  ${city}, ${province}, ${country}`}</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <TbLanguage className="text-signininput4" size={24} />
              <div>
                <h1 className="text-base text-signininput4">Languages</h1>
                <p className="text-base text-modaltext">{languagesList}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetail;
