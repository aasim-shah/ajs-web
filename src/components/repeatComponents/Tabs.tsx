"use client";
import { useState, useEffect } from 'react';

// Define the type for the tabs prop
type Tab = {
  title: string;
  content: JSX.Element;
};

type TabsProps = {
  tabs: Tab[];
};

const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Set active tab based on URL hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    const index = tabs.findIndex(
      (tab) => tab.title.toLowerCase().replace(/\s+/g, '-') === hash
    );
    if (index !== -1) {
      setActiveTab(index);
    }
    setLoading(false); // Set loading to false after determining the active tab
  }, [tabs]);

  const handleTabClick = (index: number, title: string) => {
    setActiveTab(index);
    window.location.hash = title.toLowerCase().replace(/\s+/g, '-');
  };

  if (loading) {
    return <div>Loading...</div>; // Or any loading spinner you prefer
  }

  return (
    <div className="overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto whitespace-nowrap">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`relative md:text-lg text-md px-4 py-2 ${
                activeTab === index ? 'text-modaltext' : 'text-signininput4'
              }`}
              onClick={() => handleTabClick(index, tab.title)}
            >
              {tab.title}
              {activeTab === index && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-signature"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
