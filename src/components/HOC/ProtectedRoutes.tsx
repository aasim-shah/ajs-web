

// src/components/HOC/ProtectedRoutes.tsx
"use client";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";
const withProtectedRoutes = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const ProtectedRoutes: React.FC<P> = (props) => {
    const router = useRouter();
    useEffect(() => {
      if (!localStorage.getItem("accessToken")) {
        router.push("/signin");
      }
    }, [router]);
    return <WrappedComponent {...props} />;
  };
  return ProtectedRoutes;
};
export default withProtectedRoutes;