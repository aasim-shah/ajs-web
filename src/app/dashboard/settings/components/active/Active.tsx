import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { BsThreeDots } from "react-icons/bs";

const Active = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      <div className="flex items-center p-8 justify-between">
        <div>
          <h1 className="text-2xl">Active</h1>
        </div>
        <div className="flex items-center gap-5">
          <div>
            <Switch
              checked={isChecked}
              onCheckedChange={setIsChecked}
              checkedClassName="bg-signature" // Your custom class for the checked state
              uncheckedClassName="bg-gray-300 dark:bg-gray-300" // Your custom class for the unchecked state
            />
          </div>
          <div>
            <BsThreeDots size={35} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Active;
