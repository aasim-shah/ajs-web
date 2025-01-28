"use client";
import { useCommonData } from "@/context/commonData";
import { menu } from "@/utils/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const pathname = usePathname();
  const { changeActivePage } = useCommonData();

  const isActive = (path: string): string => {
    return (path === "/" ? pathname === path : pathname.includes(path))
      ? "bg-signature text-white"
      : "hover:text-signature text-customgrayblue";
  };

  const dashboardPath = "/dashboard";

  return (
    <div className="w-full h-screen bg-background shadow px-5 border-r-2 flex flex-col relative">
      <div className="flex justify-center items-center h-16 border-b border-blue px-2 mt-4 sm:mt-1">
        <Link
          href={"/dashboard/company-admin-panel"}
          className="text-signature text-2xl font-bold"
        >
          Asia&nbsp;<span className="text-darkBlue">Jobs</span>Swipe
        </Link>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-3 my-7">
          {menu.map(({ name, path, icon }) => (
            <Link
              key={path}
              href={`${dashboardPath}${path}`}
              className={`flex items-center gap-1.5 font-semibold text-xs px-2 md:px-5 py-3 transition-colors cursor-pointer rounded-lg ${isActive(
                path
              )}`}
            >
              <span
                className="svg-icon"
                dangerouslySetInnerHTML={{ __html: icon }}
                style={{
                  width: 16,
                  height: 16,
                  color: isActive(path).includes("text-white")
                    ? "white"
                    : "#7C8493",
                }}
              />
              <p
                className={
                  isActive(path).includes("text-background")
                    ? "text-background pl-2"
                    : "pl-2"
                }
              >
                {name}
              </p>
            </Link>
          ))}

          <div className="text-background border-t border-signature mt-3"></div>

          <Link href={`${dashboardPath}/post-job`}>
            <Button
              variant="outline"
              className="flex gap-4 justify-start w-full rounded-xl text-background py-4 bg-darkGrey mt-3 text-xs"
            >
              <FaPlus className="text-background" size={16} /> Post a New Job
            </Button>
          </Link>
        </div>

        <div className="pt-1 mt-2">
          <Link
            href={`${dashboardPath}/settings`}
            className={`flex items-center gap-1.5 font-semibold text-xs p-2 transition-colors cursor-pointer rounded-lg ${
              pathname.includes("/settings")
                ? "bg-signature text-background"
                : "hover:text-signature text-customgrayblue"
            }`}
          >
            <IoSettingsOutline
              style={{
                fontSize: 16,
                color: pathname.includes("/settings") ? "white" : "#7C8493",
              }}
            />
            <p
              className={
                pathname.includes("/settings")
                  ? "text-background pl-2"
                  : "text-customgrayblue pl-2"
              }
            >
              Settings
            </p>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .svg-icon svg {
          fill: currentColor;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
