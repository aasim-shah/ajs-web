"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface DashboardProtectedRoutesProps {
  children: ReactNode;
}

const DashboardProtectedRoutes: React.FC<DashboardProtectedRoutesProps> = ({ children }) => {
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (!accessToken || role !== "company") {
      router.push("/signin");
    }
  }, [auth, router]);

  return <div>{children}</div>;
};

export default DashboardProtectedRoutes;
