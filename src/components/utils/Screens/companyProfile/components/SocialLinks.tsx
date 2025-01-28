import React from "react";
import { CiLinkedin } from "react-icons/ci";
import { FaSquareFacebook } from "react-icons/fa6";
import { LuInstagram } from "react-icons/lu";

interface SocialLinksProps {
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

const SocialLinks: React.FC<SocialLinksProps> = ({ socialLinks = {} }) => {
  const { linkedin, facebook, instagram } = socialLinks;

  if (!linkedin && !facebook && !instagram) {
    return null; // Don't render the component if there are no social links
  }

  return (
    <div className="border rounded-[20px] py-6 px-5">
      <div className="flex justify-between">
        <h1 className="text-modaltext text-2xl">Social Links</h1>
      </div>
      {linkedin && (
        <div className="pt-8">
          <div className="flex gap-5">
            <div><CiLinkedin className="text-signininput4" size={30} /></div>
            <div>
              <h1 className="text-lg text-signininput4">LinkedIn</h1>
              <p className="text-lg text-signature">{linkedin}</p>
            </div>
          </div>
        </div>
      )}
      {facebook && (
        <div className="py-8">
          <div className="flex gap-5">
            <div><FaSquareFacebook className="text-signininput4" size={30} /></div>
            <div>
              <h1 className="text-lg text-signininput4">Facebook</h1>
              <p className="text-lg text-signature">{facebook}</p>
            </div>
          </div>
        </div>
      )}
      {instagram && (
        <div>
          <div className="flex gap-5">
            <div><LuInstagram className="text-signininput4" size={30} /></div>
            <div>
              <h1 className="text-lg text-signininput4">Instagram</h1>
              <p className="text-lg text-signature">{instagram}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialLinks;
