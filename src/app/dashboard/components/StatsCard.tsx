import React from "react";

interface StatsData {
  icon: React.ComponentType;
  title: string;
  value: number | string;
  percentage: number;
  change: boolean;
}

const StatsCard: React.FC<StatsData> = ({
  icon: Icon,
  title,
  value,
  percentage,
  change,
}) => {
  return (
    <div className="flex items-center bg-background rounded-lg p-4 shadow-md">
      <div className="mr-4 text-xl">
        <Icon />
      </div>
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">{value}</p>
          <p
            className={`text-sm ${change ? "text-green-500" : "text-red-500"}`}
          >
            {change ? `+${percentage}%` : `-${percentage}%`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
