"use client";
import { useEffect, useState } from "react";
import NextTopLoader from "nextjs-toploader";
import { useTheme } from "next-themes";

const TopLoader = () => {

  return (
    <NextTopLoader
      color={"#1f80ff"}
      initialPosition={0.08}
      crawlSpeed={200}
      height={2}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow={`0 0 10px ${"#1f80ff"}}, 0 0 5px ${"#1f80ff"}}`}
    />
  );
};

export default TopLoader;
