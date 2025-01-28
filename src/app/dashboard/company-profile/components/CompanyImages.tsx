"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  fetchCompanyProfile,
  addOrUpdateCompanyImages,
  deleteCompanyImage,
} from "@/store/slices/companyProfileSlice/companyProfileSlice";
import Image from "next/image";
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
import { FaPlus } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CompanyData } from "../page";

interface CompanyImagesProps {
  companyImages?: string[];
  companyData: CompanyData;
  onUpdate: (updates: Partial<{ companyImages: string[] }>) => Promise<void>;
}

const CompanyImages: React.FC<CompanyImagesProps> = ({
  companyImages = [],
  companyData,
  onUpdate,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>(companyImages);
  const [newImage, setNewImage] = useState<string>("");
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setCurrentImages(companyImages);
  }, [companyImages]);

  // const handleSave = async () => {
  //   const storedCompanyId = localStorage.getItem("_id");
  //   const storedAccessToken = localStorage.getItem("accessToken");

  //   if (storedCompanyId && storedAccessToken) {
  //     const files = currentImages
  //       .map((image, index) =>
  //         image.startsWith("data:")
  //           ? dataURLtoFile(image, `image_${index}.jpg`)
  //           : null
  //       )
  //       .filter((file) => file !== null) as File[];

  //     if (files.length > 0) {
  //       try {
  //         await dispatch(
  //           addOrUpdateCompanyImages({
  //             companyId: storedCompanyId,
  //             images: files,
  //             token: storedAccessToken,
  //           })
  //         ).unwrap();
  //         setIsEditing(false);
  //         await onUpdate({ companyImages: currentImages });
  //       } catch (error) {
  //         console.error("Failed to save images: ", error);
  //         alert("Failed to save images. Please try again.");
  //       }
  //     }
  //   } else {
  //     console.error("Missing authentication tokens. Please log in again.");
  //     alert("Missing authentication tokens. Please log in again.");
  //   }
  // };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => setNewImage(reader.result as string);
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // };

  // const addImage = () => {
  //   if (newImage) {
  //     setCurrentImages([...currentImages, newImage]);
  //     setNewImage("");
  //   } else {
  //     console.error("No image selected to add.");
  //   }
  // };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string); // Set preview
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const addImage = () => {
    if (newImage) {
      setCurrentImages([...currentImages, newImage]); // Add image to preview list
      setNewImage(""); // Clear new image state

      // Reset file input field after adding the image
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input field
      }
    } else {
      console.error("No image selected to add.");
    }
  };

  const confirmRemoveImage = (index: number) => {
    setImageToDelete(index);
    setIsConfirmDialogOpen(true);
  };

  const handleSave = async () => {
    const storedCompanyId = localStorage.getItem("_id");
    const storedAccessToken = localStorage.getItem("accessToken");

    if (storedCompanyId && storedAccessToken) {
      // Filter out new images (data URLs) to send to the backend
      const files = currentImages
        .map((image, index) =>
          image.startsWith("data:")
            ? dataURLtoFile(image, `image_${index}.jpg`) // Convert base64 to File
            : null
        )
        .filter((file) => file !== null) as File[];

      if (files.length > 0) {
        try {
          await dispatch(
            addOrUpdateCompanyImages({
              companyId: storedCompanyId,
              images: files,
              token: storedAccessToken,
            })
          ).unwrap();
          setIsEditing(false);
          await onUpdate({ companyImages: currentImages });
        } catch (error) {
          console.error("Failed to save images: ", error);
          alert("Failed to save images. Please try again.");
        }
      }
    } else {
      console.error("Missing authentication tokens. Please log in again.");
      alert("Missing authentication tokens. Please log in again.");
    }
  };

  const removeImage = async () => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedCompanyId = localStorage.getItem("_id");

    if (storedAccessToken && imageToDelete !== null && storedCompanyId) {
      try {
        // Fetch the latest company profile to get the up-to-date image URL
        const companyProfileResponse = await dispatch(
          fetchCompanyProfile(storedCompanyId)
        ).unwrap();

        const updatedCompanyImages = companyProfileResponse.companyImages || [];
        const imageUrl = updatedCompanyImages[imageToDelete];

        if (imageUrl) {
          const response = await dispatch(
            deleteCompanyImage({ filename: imageUrl, token: storedAccessToken })
          ).unwrap();

          // Update the images array after successful deletion
          const updatedImages = updatedCompanyImages.filter(
            (_, i) => i !== imageToDelete
          );
          await onUpdate({ companyImages: updatedImages });

          setIsConfirmDialogOpen(false);
          setImageToDelete(null);
        } else {
          console.error("Failed to find the image URL to delete.");
        }
      } catch (error) {
        console.error("Failed to delete the image: ", error);
        alert("Failed to delete the image. Please try again.");
      }
    } else {
      console.error(
        "Invalid deletion request or missing authentication tokens."
      );
      alert("Invalid deletion request or missing authentication tokens.");
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    let [header, base64] = dataurl.split(",");
    let mime = header.match(/:(.*?);/)?.[1];
    let binary = atob(base64);
    let array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new File([array], filename, { type: mime });
  };

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsImageDialogOpen(true);
  };

  return (
    <div className="border rounded-[20px] py-6 px-5">
      <div className="flex justify-between mb-5">
        <h1 className="text-modaltext sm:text-xl md:text-2xl">
          Company Images
        </h1>
        <div className="sm:flex items-center gap-4">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button className="text-signature mb-3" variant="outline">
                Edit Images
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-6">
              <DialogHeader>
                <DialogTitle className="md:text-2xl font-bold">
                  Edit Images
                </DialogTitle>
                <DialogDescription className="text-md text-gray-500">
                  Manage your company images.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-4 py-4">
                {currentImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative"
                    onClick={() => handleImageClick(image)}
                  >
                    <Image
                      src={image}
                      alt="Company Image"
                      width={150}
                      height={150}
                      className="rounded cursor-pointer"
                    />
                    <button
                      // className="absolute top-0 right-0 p-1 bg-signature rounded-full text-red-600 font-bold"
                      className="absolute top-0 right-0  font-bold text-xs text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmRemoveImage(index);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <DialogFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSave}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingImage} onOpenChange={setIsAddingImage}>
            <DialogTrigger asChild>
              <Button className="text-signature" variant="outline">
                <FaPlus /> Add Image
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Add New Image
                </DialogTitle>
                <DialogDescription className="text-md text-gray-500">
                  Select and upload a new image.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newImage" className="text-right">
                    New Image
                  </Label>
                  <Input
                    id="newImage"
                    name="newImage"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="col-span-3"
                  />
                  <Button className="col-span-1" onClick={addImage}>
                    Upload
                  </Button>
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingImage(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    addImage();
                    handleSave(); // Save the new image to the server
                    setIsAddingImage(false);
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Carousel className="relative w-full max-w-full">
        <CarouselContent className="flex gap-4">
          {currentImages.map((image, index) => (
            <CarouselItem
              key={index}
              className="flex items-center justify-center w-full"
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image
                      src={image}
                      alt={`Company Image ${index + 1}`}
                      width={400}
                      height={300}
                      className="rounded object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2" />
        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2" />
      </Carousel>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={removeImage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle>View Image</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="flex justify-center">
              <Image
                src={selectedImage}
                alt="Selected Company Image"
                width={500}
                height={500}
                className="rounded object-cover"
              />
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsImageDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyImages;
// fhfdg gd gsdfsdf gsdfsdfdf
