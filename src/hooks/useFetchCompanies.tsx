"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Define the Pagination type
type Pagination = {
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
};

// changePagination is a prop that takes a function to set the pagination

const useFetchCompanies = (
  api: string,
  changePagination: (pagination: Pagination) => void
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      // if (!token) {
      //   setError(new Error("No token found"));
      //   setLoading(false);
      //   return;
      // }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.get(api, config);
        setData(response.data);
        changePagination(response.data.pagination);
      } catch (error: any) {
        setError(error);
      }
      setLoading(false);
    };

    fetchCompanies();
  }, [api]);

  return { data, loading, error };
};

export default useFetchCompanies;
