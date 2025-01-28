"use client";

import { useCommonData } from "@/context/commonData";
import { useEffect } from "react";

interface TitleProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const Title = ({ title, className, children }: TitleProps) => {
  const { changeActivePage } = useCommonData();

  useEffect(() => {
    changeActivePage(title);
  }, [title, changeActivePage]);

  return <div className={className}>{children}</div>;
};

export default Title;
