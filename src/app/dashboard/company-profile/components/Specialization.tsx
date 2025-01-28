// import React, { useState, useRef } from "react";
// import { FaRegEdit } from "react-icons/fa";
// import { FiPlus, FiX } from "react-icons/fi";
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const Specialization = () => {
//   const [specializations, setSpecializations] = useState([
//     "Communication",
//     "Analytics",
//     "Facebook Ads",
//     "Content Planning",
//     "Community Manager",
//   ]);
//   const [isAdding, setIsAdding] = useState(false);
//   const [currentSpecialization, setCurrentSpecialization] = useState("");
//   const [specializationIndex, setSpecializationIndex] = useState<number | null>(null);
//   const [editingIndex, setEditingIndex] = useState<number | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   const handleSave = () => {
//     if (specializationIndex !== null) {
//       const updatedSpecializations = [...specializations];
//       updatedSpecializations[specializationIndex] = currentSpecialization;
//       setSpecializations(updatedSpecializations);
//     } else {
//       setSpecializations([...specializations, currentSpecialization]);
//     }
//     setIsAdding(false);
//     setCurrentSpecialization("");
//     setSpecializationIndex(null);
//   };

//   const handleDelete = (index: number) => {
//     const updatedSpecializations = specializations.filter((_, i) => i !== index);
//     setSpecializations(updatedSpecializations);
//   };

//   const handleEdit = (index: number) => {
//     setCurrentSpecialization(specializations[index]);
//     setEditingIndex(index);
//     setTimeout(() => {
//       if (inputRef.current) {
//         inputRef.current.focus();
//       }
//     }, 0);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCurrentSpecialization(e.target.value);
//   };

//   const handleBlur = () => {
//     if (editingIndex !== null) {
//       const updatedSpecializations = [...specializations];
//       updatedSpecializations[editingIndex] = currentSpecialization;
//       setSpecializations(updatedSpecializations);
//       setEditingIndex(null);
//     }
//   };

//   return (
//     <div className="border rounded-[20px] py-6 px-5">
//       <div className="flex justify-between mb-5">
//         <h1 className="text-modaltext text-2xl">Specialization</h1>
//         <div className="flex gap-2">
//           <Dialog open={isAdding} onOpenChange={setIsAdding}>
//             <DialogTrigger asChild>
//               <FiPlus className="text-signature border rounded-lg p-2 cursor-pointer" size={40} onClick={() => setIsAdding(true)} />
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[600px] p-6">
//               <DialogHeader>
//                 <DialogTitle className="text-2xl font-bold">Add Specialization</DialogTitle>
//                 <DialogDescription className="text-md text-gray-500">
//                   Add a new specialization here. Click save when you are done.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="specializationName" className="text-right">
//                     Specialization Name
//                   </Label>
//                   <Input
//                     id="specializationName"
//                     name="specializationName"
//                     value={currentSpecialization}
//                     onChange={handleChange}
//                     placeholder="Specialization Name"
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
//         {specializations.map((specialization, index) => (
//           <div key={index} className="relative flex items-center">
//             {editingIndex === index ? (
//               <Input
//                 ref={inputRef}
//                 value={currentSpecialization}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className="bg-bglite text-base text-signature"
//               />
//             ) : (
//               <Button
//                 className="bg-bglite text-base text-signature"
//                 onClick={() => handleEdit(index)}
//               >
//                 {specialization}
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

// export default Specialization;
