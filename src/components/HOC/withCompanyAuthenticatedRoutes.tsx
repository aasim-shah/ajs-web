"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const withCompanyAuthenticatedRoutes = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const AuthenticatedRoutes: React.FC<P> = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      const role = localStorage.getItem("role");

      if (!token || role !== "company") {
        router.push("/signin");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedRoutes;
};

export default withCompanyAuthenticatedRoutes;
