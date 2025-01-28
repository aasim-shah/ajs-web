import React from "react";

interface SkillsProps {
  skills: string[];
}

const Skills: React.FC<SkillsProps> = ({ skills = [] }) => {
  return (
    <div className="border rounded-[20px] py-6 px-5">
      <div className="flex justify-between mb-5">
        <h1 className="text-modaltext text-2xl">Skills</h1>
      </div>
      <div className="flex gap-3 flex-wrap">
        {skills.map((skill, index) => (
          <div key={index} className="relative flex items-center">
            <button className="bg-bglite text-base text-signature">{skill}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
