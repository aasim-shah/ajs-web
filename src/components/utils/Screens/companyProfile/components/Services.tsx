import React from "react";

interface ServicesProps {
  services: string[];
}

const Services: React.FC<ServicesProps> = ({ services = [] }) => {
  return (
    <div className="border rounded-[20px] py-6 px-5">
      <div className="flex justify-between mb-5">
        <h1 className="text-modaltext text-2xl">Services</h1>
      </div>
      <div className="flex gap-3 flex-wrap">
        {services.map((service, index) => (
          <div key={index} className="relative flex items-center">
            <button className="bg-bglite text-base text-signature">{service}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
