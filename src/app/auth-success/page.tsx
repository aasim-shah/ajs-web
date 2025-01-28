"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SuccessGoogleContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Ensure this block only runs on the client side
    if (typeof window !== "undefined") {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const role = searchParams.get("role");

      if (accessToken && refreshToken && role) {
        // Store tokens and role in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);

        // Redirect based on role
        if (role === "company") {
          router.push("/dashboard");
        } else if (role === "jobSeeker") {
          router.push("/");
        } else {
          router.push("/signin");
        }
      } else {
        router.push("/signin");
      }
    }
  }, [router, searchParams]);

  return <div>Signing in...</div>;
};

const SuccessGoogle: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessGoogleContent />
    </Suspense>
  );
};

export default SuccessGoogle;
