import React from "react";

interface AboutMeProps {
  description: string;
}

const AboutMe: React.FC<AboutMeProps> = ({ description = "Default description" }) => {
  return (
    <div className="border p-6 rounded-[20px] relative">
      <div className="flex justify-between">
        <h1 className="text-modaltext text-2xl">Description</h1>
      </div>
      <div className="text-signininput text-lg">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default AboutMe;
