import React from "react";

interface SpecializationProps {
  specialty: string[];
}

const Specialization: React.FC<SpecializationProps> = ({ specialty }) => {
  return (
    <div className="border rounded-[20px] py-6 px-5">
      <div className="flex justify-between mb-5">
        <h1 className="text-modaltext text-2xl">Specialization</h1>
      </div>

      <div className="flex gap-3 flex-wrap">
        {specialty.map((specialization, index) => (
          <div key={index} className="relative flex items-center">
            <button className="bg-bglite text-base text-signature">{specialization}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Specialization;
