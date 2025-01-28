"use client";

import { useState, useEffect } from "react";

const useIsAuthenticated = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  return isAuthenticated;
};

export default useIsAuthenticated;
