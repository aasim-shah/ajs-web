"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AppDispatch } from "@/store";
import { addOrUpdateCompanyLogo } from "@/store/slices/companyProfileSlice/companyProfileSlice";
import { FaGripfire, FaUsers } from "react-icons/fa";
import { TbBuildingSkyscraper } from "react-icons/tb";

interface ProfileCompletionProps {
  company: {
    _id: string;
    companyName: string;
    website: string;
    foundedYear: string;
    numberOfEmployees: string;
    sector: string;
    companyLogo: string;
    companyImages: string[];
    profileCompletion: number;
  };
  token: string;
  onUpdate: (updates: Partial<{
    _id: string;
    companyName: string;
    website: string;
    foundedYear: string;
    numberOfEmployees: string;
    sector: string;
    companyLogo: string;
    companyImages: string[];
  }>) => Promise<void>;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ company, token, onUpdate }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: company.companyName,
    website: company.website,
    foundedYear: company.foundedYear,
    numberOfEmployees: company.numberOfEmployees,
    sector: company.sector,
  });
  const [profileImage, setProfileImage] = useState(company.companyLogo || "/images/placeholderimage.png");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFormData({
      companyName: company.companyName,
      website: company.website,
      foundedYear: company.foundedYear,
      numberOfEmployees: company.numberOfEmployees,
      sector: company.sector,
    });
    setProfileImage(company.companyLogo || "/images/placeholderimage.png");
  }, [company]);

  const handleSave = async () => {
    const updates = {
      companyName: formData.companyName,
      website: formData.website,
      foundedYear: formData.foundedYear,
      numberOfEmployees: formData.numberOfEmployees,
      sector: formData.sector,
      companyLogo: profileImage,
    };

    await onUpdate(updates);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      companyName: company.companyName,
      website: company.website,
      foundedYear: company.foundedYear,
      numberOfEmployees: company.numberOfEmployees,
      sector: company.sector,
    });
    setProfileImage(company.companyLogo || "/images/placeholderimage.png");
    setIsEditing(false);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const storedCompanyId = company._id;

    if (!storedCompanyId || !token) {
      console.error("Company ID or token is not available.");
      return;
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("companyLogo", file);

      try {
        const result = await dispatch(addOrUpdateCompanyLogo({ companyId: storedCompanyId, logo: formData, token })).unwrap();
        setProfileImage(result.companyLogo || "/images/placeholderimage.png");
      } catch (error) {
        console.error("Failed to update company logo: ", error);
      }
    }
  };

  return (
    <div className="border rounded-[20px] relative">
      <div className="sm:flex gap-4 items-center rounded-tr-[20px] rounded-tl-[20px] bg-gradient-to-tr from-blue to-blue/20 p-5 relative">
        <div className="w-1/3 md:relative">
          <div
            className="md:absolute border-8 rounded-full border-background md:left-[40px] md:top-[10px] w-24 h-24 md:w-36 md:h-36 overflow-hidden cursor-pointer bg-gray-300 dark:bg-gray-300 flex items-center justify-center text-background text-2xl"
            onClick={handleImageClick}
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt="profile"
                width={150}
                height={150}
                className="rounded-full object-cover w-24 md:w-36"
                onError={() => setProfileImage("/images/placeholderimage.png")}     
              />
            ) : (
              <span>No Image</span>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="md:w-2/3 w-full md:py-10">
          <div className="flex text-background justify-between">
            <div className="pb-3">
              <h1>Profile Completion</h1>
            </div>
            <div>
              <h1>{company.profileCompletion}%</h1>
            </div>
          </div>
          <Progress color="bg-darkGrey" value={company.profileCompletion} className="md:w-[100%] w-[80%]" />
        </div>
      </div>

      <div className="md:flex md:p-5 gap-3 md:gap-10">
        <div className="flex md:flex-col mt-5 gap-3 md:mt-16 md:items-center md:w-1/3"></div>
        <div className="md:w-2/3 p-4">
          <div className="flex justify-between">
            <div>
              <h1 className="md:text-3xl text-xl text-modaltext">{formData.companyName || "Full Name"}</h1>
              <p className="md:text-xl text-md text-signininput4 py-2">
                <Link
                  href={formData.website || "#"}
                  className="text-signature hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formData.website || "https://ajs-files.hostdonor.com"}
                </Link>
              </p>
            </div>
            <div>
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button className="text-signature" variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] p-6">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                    <DialogDescription className="text-md text-gray-500">
                      Make changes to your profile here. Click save when you are done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="companyName" className="text-right">
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="website" className="text-right">
                        Website
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="Website"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="foundedYear" className="text-right">
                        Founded Year
                      </Label>
                      <Input
                        id="foundedYear"
                        name="foundedYear"
                        value={formData.foundedYear}
                        onChange={handleChange}
                        placeholder="Founded Year"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="numberOfEmployees" className="text-right">
                        Number of Employees
                      </Label>
                      <Input
                        id="numberOfEmployees"
                        name="numberOfEmployees"
                        value={formData.numberOfEmployees}
                        onChange={handleChange}
                        placeholder="Number of Employees"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="sector" className="text-right">
                        Industry
                      </Label>
                      <Input
                        id="sector"
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        placeholder="Industry"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleSave}>
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 md:px-7 pb-5 md:flex justify-around">
        <div className="flex items-center gap-3">
          <div>
            <FaGripfire className="text-signature" size={30} />
          </div>
          <div className="text-xl">
            <h1 className="text-signininput">Founded Year</h1>
            <p>{formData.foundedYear}</p>
          </div>
        </div>
        <div className="flex items-center py-5 gap-3">
          <div>
            <FaUsers className="text-signature" size={30} />
          </div>
          <div className="text-xl">
            <h1 className="text-signininput">Number of Employees</h1>
            <p>{formData.numberOfEmployees}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <TbBuildingSkyscraper className="text-signature" size={30} />
          </div>
          <div className="text-xl">
            <h1 className="text-signininput">Industry</h1>
            <p>{formData.sector}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
