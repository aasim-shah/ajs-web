// import React, { useState, useRef } from "react";
// import { FaRegEdit } from "react-icons/fa";
// import { FiPlus, FiX } from "react-icons/fi";
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const Skills = () => {
//   const [skills, setSkills] = useState([
//     "Communication",
//     "Analytics",
//     "Facebook Ads",
//     "Content Planning",
//     "Community Manager",
//   ]);
//   const [isAdding, setIsAdding] = useState(false);
//   const [currentSkill, setCurrentSkill] = useState("");
//   const [skillIndex, setSkillIndex] = useState<number | null>(null);
//   const [editingIndex, setEditingIndex] = useState<number | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const handleSave = () => {
//     if (skillIndex !== null) {
//       const updatedSkills = [...skills];
//       updatedSkills[skillIndex] = currentSkill;
//       setSkills(updatedSkills);
//     } else {
//       setSkills([...skills, currentSkill]);
//     }
//     setIsAdding(false);
//     setCurrentSkill("");
//     setSkillIndex(null);
//   };

//   const handleDelete = (index: number) => {
//     const updatedSkills = skills.filter((_, i) => i !== index);
//     setSkills(updatedSkills);
//   };

//   const handleEdit = (index: number) => {
//     setCurrentSkill(skills[index]);
//     setEditingIndex(index);
//     setTimeout(() => {
//       if (inputRef.current) {
//         inputRef.current.focus();
//       }
//     }, 0);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCurrentSkill(e.target.value);
//   };

//   const handleBlur = () => {
//     if (editingIndex !== null) {
//       const updatedSkills = [...skills];
//       updatedSkills[editingIndex] = currentSkill;
//       setSkills(updatedSkills);
//       setEditingIndex(null);
//     }
//   };

//   return (
//     <div className="border rounded-[20px] py-6 px-5">
//       <div className="flex justify-between mb-5">
//         <h1 className="text-modaltext text-2xl">Skills</h1>
//         <div className="flex gap-2">
//           <Dialog open={isAdding} onOpenChange={setIsAdding}>
//             <DialogTrigger asChild>
//               <FiPlus className="text-signature border rounded-lg p-2 cursor-pointer" size={40} onClick={() => setIsAdding(true)} />
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[600px] p-6">
//               <DialogHeader>
//                 <DialogTitle className="text-2xl font-bold">Add Skill</DialogTitle>
//                 <DialogDescription className="text-md text-gray-500">
//                   Add a new skill here. Click save when you are done.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="skillName" className="text-right">
//                     Skill Name
//                   </Label>
//                   <Input
//                     id="skillName"
//                     name="skillName"
//                     value={currentSkill}
//                     onChange={handleChange}
//                     placeholder="Skill Name"
//                     className="col-span-3"
//                   />
//                 </div>
//               </div>
//               <DialogFooter className="flex justify-between">
//                 <Button variant="outline" onClick={() => setIsAdding(false)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" onClick={handleSave}>
//                   Save changes
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       <div className="flex gap-3 flex-wrap">
//         {skills.map((skill, index) => (
//           <div key={index} className="relative flex items-center">
//             {editingIndex === index ? (
//               <Input
//                 ref={inputRef}
//                 value={currentSkill}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className="bg-bglite text-base text-signature"
//               />
//             ) : (
//               <Button
//                 className="bg-bglite text-base text-signature"
//                 onClick={() => handleEdit(index)}
//               >
//                 {skill}
//               </Button>
//             )}
//             <FiX
//               className="text-red-500 absolute top-0 right-0 p-1 cursor-pointer"
//               size={20}
//               onClick={() => handleDelete(index)}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Skills;
