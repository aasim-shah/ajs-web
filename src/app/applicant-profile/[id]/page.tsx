import React from "react";
import Tabs from "./components/Tabs";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <Tabs />
    </div>
  );
};

export default page;
