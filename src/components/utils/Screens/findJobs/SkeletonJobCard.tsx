import React from 'react';
import { Card } from "@/components/ui/card";

const SkeletonJobCard: React.FC = () => {
  return (
    <Card className="container mb-5 p-4 animate-pulse">
      <div className="">
        <div className="bg-background">
          <div className="flex justify-between mb-5 md:mb-2">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-300 dark:bg-gray-300 rounded-full mr-4"></div>
              <div>
                <div className="w-32 h-6 bg-gray-300 dark:bg-gray-300 mb-2"></div>
                <div className="w-48 h-4 bg-gray-300 dark:bg-gray-300"></div>
              </div>
            </div>
            <div className="md:mt-3">
              <div className="md:hidden mb-2 flex justify-end">
                <div className="w-5 h-5 bg-gray-300 dark:bg-gray-300 rounded-full"></div>
              </div>
              <div className="w-24 h-6 bg-gray-300 dark:bg-gray-300"></div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-wrap gap-3 md:ml-20 items-center mt-2">
              <div className="w-24 h-6 bg-gray-300 dark:bg-gray-300 rounded-full"></div>
              <div className="hidden md:block h-5 border border-lightgrey"></div>
              <div className="w-24 h-6 bg-gray-300 dark:bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex flex-col mt-2">
              <div className="w-24 h-8 bg-gray-300 dark:bg-gray-300 rounded-md mb-2"></div>
              <div className="w-24 h-6 bg-gray-300 dark:bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SkeletonJobCard;
