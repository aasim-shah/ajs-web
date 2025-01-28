// import React, { useState } from 'react';
// import { CiLinkedin } from "react-icons/ci";
// import { FaRegEdit } from "react-icons/fa";
// import { FaSquareFacebook } from "react-icons/fa6";
// import { LuInstagram } from "react-icons/lu";
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const SocialLinks = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [links, setLinks] = useState({
//     linkedin: "www.linkedin.xyz",
//     facebook: "www.facebook.xyz",
//     instagram: "www.Instagram.xyz",
//   });
//   const [formData, setFormData] = useState(links);

//   const handleEditClick = () => {
//     setFormData(links); // Reset form data to current links
//     setIsEditing(true);
//   };

//   const handleSave = () => {
//     setLinks(formData);
//     setIsEditing(false);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   return (
//     <div className="border rounded-[20px] py-6 px-5">
//       <div className="flex justify-between">
//         <h1 className="text-modaltext text-2xl">Social Links</h1>
//         <button onClick={handleEditClick}>
//           <FaRegEdit className="text-signature border rounded-lg p-2 cursor-pointer" size={40} />
//         </button>
//       </div>

//       <div className="pt-8">
//         <div className="flex gap-5">
//           <div><CiLinkedin className="text-signininput4" size={30} /></div>
//           <div>
//             <h1 className="text-lg text-signininput4">LinkedIn</h1>
//             <p className="text-lg text-signature">{links.linkedin}</p>
//           </div>
//         </div>
//       </div>

//       <div className="py-8">
//         <div className="flex gap-5">
//           <div><FaSquareFacebook className="text-signininput4" size={30} /></div>
//           <div>
//             <h1 className="text-lg text-signininput4">Facebook</h1>
//             <p className="text-lg text-signature">{links.facebook}</p>
//           </div>
//         </div>
//       </div>

//       <div>
//         <div className="flex gap-5">
//           <div><LuInstagram className="text-signininput4" size={30} /></div>
//           <div>
//             <h1 className="text-lg text-signininput4">Instagram</h1>
//             <p className="text-lg text-signature">{links.instagram}</p>
//           </div>
//         </div>
//       </div>

//       <Dialog open={isEditing} onOpenChange={setIsEditing}>
//         <DialogContent className="sm:max-w-[600px] p-6">
//           <DialogHeader>
//             <DialogTitle className="text-2xl font-bold">Edit Social Links</DialogTitle>
//             <DialogDescription className="text-md text-gray-500">
//               Make changes to your social links here. Click save when you are done.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="linkedin" className="text-right">
//                 LinkedIn
//               </Label>
//               <Input
//                 id="linkedin"
//                 name="linkedin"
//                 value={formData.linkedin}
//                 onChange={handleChange}
//                 placeholder="LinkedIn URL"
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="facebook" className="text-right">
//                 Facebook
//               </Label>
//               <Input
//                 id="facebook"
//                 name="facebook"
//                 value={formData.facebook}
//                 onChange={handleChange}
//                 placeholder="Facebook URL"
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="instagram" className="text-right">
//                 Instagram
//               </Label>
//               <Input
//                 id="instagram"
//                 name="instagram"
//                 value={formData.instagram}
//                 onChange={handleChange}
//                 placeholder="Instagram URL"
//                 className="col-span-3"
//               />
//             </div>
//           </div>
//           <DialogFooter className="flex justify-between">
//             <Button variant="outline" onClick={() => setIsEditing(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" onClick={handleSave}>
//               Save changes
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default SocialLinks;
