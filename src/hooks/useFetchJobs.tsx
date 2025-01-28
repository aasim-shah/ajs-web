"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useJobsData } from "@/context/jobsData";

const useFetchJobs = (api: string) => {
  const { changePagination } = useJobsData();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [api]);

  return { data, loading, error };
};

export default useFetchJobs;
