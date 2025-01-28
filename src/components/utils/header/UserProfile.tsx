"use client";
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RootState, AppDispatch } from '@/store';
import { getJobSeekerById } from '@/store/slices/jobSeekersSlice';
import Image from 'next/image';
import Link from 'next/link';

interface UserProfileProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isDialogOpen, setIsDialogOpen, handleLogout }) => {
  const dispatch = useDispatch<AppDispatch>();

  const jobSeeker = useSelector((state: RootState) => state.auth.user);
  const jobSeekerData = useSelector((state: RootState) => state.jobSeekers.jobSeeker);

  useEffect(() => {
    const jobSeekerId = localStorage.getItem('_id'); // Adjust this key if necessary
    if (jobSeekerId) {
      dispatch(getJobSeekerById(jobSeekerId));
    }
  }, [dispatch]);

  // Use a default avatar image if none is provided
  const avatarSrc = jobSeekerData?.profilePicture || '/images/placeholderimage.png';

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 relative">
              <Image
                src={avatarSrc}
                alt="avatar"
                className="rounded-full object-cover"
                layout="fill" // This makes the image fill the container
              />
            </div>
            <div>
              <p className="font-semibold truncate overflow-hidden">
                {jobSeekerData?.firstName ?? 'Guest'}
              </p>
            </div>
            <Button variant="ghost" className="border-none outline-none">
              <IoIosArrowDown />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 truncate">
          <DropdownMenuLabel>{jobSeeker?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/myprofile">
            <DropdownMenuItem className="gap-2 hover:text-signature transition-colors cursor-pointer">
              Profile Settings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            <MdLogout className="w-[1.2rem] h-[1.2rem]" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className="sm:max-w-[425px] sm:max-h-[300px] bg-background p-5">
        <DialogHeader>
          <DialogTitle>Confirm Sign Out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="destructive" className='bg-signature text-background' onClick={handleLogout}>Sign Out</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
