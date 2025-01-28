"use client";
import { useCommonData } from "@/context/commonData";

// Define the Tab type as a string
type Tab = string;

interface Props {
  activeTab: string;
  changeTab: (tab: Tab) => void;
  tabMenu: string[];
}

const MenuTab = ({ activeTab, changeTab, tabMenu }: Props) => {
  const { changeActivePage } = useCommonData();
  const isActive = (path: string): string => {
    return path === activeTab
      ? "bg-signature/20 text-signature"
      : "text-primary/75 hover:text-signature";
  };

  return (
    <ul className="flex gap-4 h-8">
      {tabMenu.map((tab) => (
        <li
          key={tab}
          className={`${isActive(
            tab
          )} capitalize flex items-center font-semibold h-full px-2 transition-colors cursor-pointer rounded-lg`}
          onClick={() => changeTab(tab as Tab)}
        >
          {tab}
        </li>
      ))}
    </ul>
  );
};

export default MenuTab;
