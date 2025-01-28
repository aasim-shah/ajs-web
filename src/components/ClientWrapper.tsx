"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ProtectedRoute from "./ProtectedRoute";

const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  // Define the public paths that can be accessed without authentication
  const publicPaths = ["/signin", "/send-otp", "/newotp", "/signup", "/home"];
  const accessibleWithoutAuth = publicPaths.includes(pathname);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        if (!accessibleWithoutAuth) {
          router.push("/signin");
        }
      } else {
        if (pathname === "/signin" || pathname === "/signup") {
          router.push("/home");
        }
      }
    }
  }, [pathname, router, accessibleWithoutAuth]);

  return (
    <ProtectedRoute accessibleWithoutAuth={accessibleWithoutAuth}>
      {children}
    </ProtectedRoute>
  );
};

export default ClientWrapper;
