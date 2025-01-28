"use client";
import { useCommonData } from "@/context/commonData";

// Define the Tab type
type Tab = string;

interface Props {
  activeTab: string;
  changeTab: (tab: Tab) => void;
  tabMenu: string[];
}

const MenuTabsApplicationProfile = ({ activeTab, changeTab, tabMenu }: Props) => {
  const { changeActivePage } = useCommonData();
  const isActive = (path: string): string => {
    return path === activeTab
      ? "after:bg-signature after:h-[3px] after:w-2/4 after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:transform after:-translate-x-1/2 text-custom-dark-blue"
      : "text-custom-gray-blue hover:text-signature";
  };

  return (
    <ul className="flex gap-4 relative h-10 pb-2">
      {tabMenu.map((tab) => (
        <li
          key={tab}
          className={`${isActive(
            tab
          )} capitalize flex items-center font-semibold h-full px-2 transition-colors cursor-pointer relative`}
          onClick={() => changeTab(tab as Tab)}
        >
          {tab}
        </li>
      ))}
    </ul>
  );
};

export default MenuTabsApplicationProfile;
