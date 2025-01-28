"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RootState, AppDispatch } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { fetchCompanyById } from "@/store/slices/companySlice";

const Admin = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const companyId = typeof window !== "undefined" ? localStorage.getItem("_id") : null;

  useEffect(() => {
    if (companyId) {
      dispatch(fetchCompanyById(companyId));
    }
  }, [companyId, dispatch]);

  const selectedCompany = useSelector((state: RootState) => state.company.selectedCompany);

  const companyLogo = selectedCompany?.companyLogo || '/images/placeholderimage.png';
  const companyName = selectedCompany?.companyName || 'Company Name';
  const companyEmail = selectedCompany?.userInfo?.email || 'company@company.com';

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("_id");
    }
    dispatch(logout());
    router.push("/signin");
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="relative w-8 h-8">
              <Image
                src={companyLogo}
                alt="avatar"
                className="rounded-full object-cover"
                layout="fill"
              />
            </div>
            <div className="hidden sm:block font-medium text-customgrayblue">
              {companyName}
            </div>
            <IoIosArrowDown className="w-4 h-4 text-signature" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>{companyEmail}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
            onSelect={() => setIsDialogOpen(true)}
          >
            <MdLogout />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] sm:max-h-[300px] bg-background p-5">
          <DialogHeader>
            <DialogTitle>Confirm Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="bg-signature text-background" onClick={handleLogout}>Sign Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
