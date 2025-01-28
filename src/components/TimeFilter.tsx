"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTimeFilter } from "@/context/TimeFilterProvider";

const TimeFilter = () => {
  const { timeFilter, timeFrames, changeTimeFilter } = useTimeFilter();
  return (
    <Select value={timeFilter} onValueChange={changeTimeFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a time frame" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {timeFrames.map((timeFrame) => (
            <SelectItem key={timeFrame.value} value={timeFrame.value}>
              {timeFrame.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TimeFilter;
