"use client";
import { useState, useEffect } from "react";
import { ThemeBtn } from "../../../components/ThemeBtn";
import Admin from "./Admin";
import { PiChatCircleText } from "react-icons/pi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCommonData } from "@/context/commonData";
import { TbBell } from "react-icons/tb";
import { HiMenuAlt2 } from "react-icons/hi"; // Import a menu icon
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/app/dashboard/components/Sidebar"; // Import Sidebar

const Navbar = () => {
  const pathname = usePathname();
  const isActive = (path: string): string => {
    return pathname == path ? "text-signature" : "";
  };

  const { activePage } = useCommonData();

  // State to track window width
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640); // Check if screen is small (640px or less)
    };

    handleResize(); // Set the initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full py-4 sticky top-0 z-50 flex items-center justify-between bg-background sm:px-4 shadow">
      <div className="flex items-center gap-2 sm:gap-4 flex-grow">
        {isSmallScreen && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="">
                <HiMenuAlt2 className="h-[1.8rem] w-[1.8rem]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <Sidebar /> {/* Directly render the Sidebar content */}
            </SheetContent>
          </Sheet>
        )}
        <div className="md:text-2xl sm:text-xl text-lg font-bold capitalize flex-grow">
          {/* {activePage} */}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeBtn />
        <Link href="/dashboard/messages">
          <PiChatCircleText
            className={`${isActive("/messages")} h-[1.4rem] w-[1.4rem]`}
          />
        </Link>
        <Link href="/dashboard/settings">
          <TbBell
            className={`${isActive("/notifications")} h-[1.4rem] w-[1.4rem]`}
          />
        </Link>
        <Admin />
      </div>
    </div>
  );
};

export default Navbar;
