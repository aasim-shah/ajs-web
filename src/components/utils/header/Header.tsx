import React from "react";
import Layout from "../layout";
import Menu from "./Menu";

const Page = () => {
  return (
    <div className="bg-muted/85 backdrop-blur w-full sticky top-0 z-50 ">
      <Menu />
    </div>
  );
};

export default Page;
