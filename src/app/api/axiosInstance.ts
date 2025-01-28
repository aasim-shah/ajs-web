// // app/api/axiosInstance.js
// import axios from "axios";

// const getToken = () => {
//   // Example: return localStorage.getItem('token');
//   // Replace with your actual token retrieval logic
//   return "your_token";
// };

// const axiosInstance = axios.create({
//   baseURL: "https://www.mybackend.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token && config.headers.requiresAuth) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle errors globally
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

// // app/api/users/getUsers.js
// import axiosInstance from "../axiosInstance";

// export const getUsers = async () => {
//     try {
//       const response = await axiosInstance.get('/users', {
//         headers: { requiresAuth: true },
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   };

// // app/api/users/createUser.js
// import axiosInstance from "../axiosInstance";

// export const createUser = async (userData) => {
//   try {
//     const response = await axiosInstance.post("/users", userData);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // app/hooks/useApi.js
// import { useState } from "react";

// const useApi = (apiFunction) => {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const execute = async (...args) => {
//     setLoading(true);
//     try {
//       const result = await apiFunction(...args);
//       setData(result);
//       setError(null);
//     } catch (err) {
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { data, error, loading, execute };
// };

// export default useApi;

// // app/context/ApiContext.js
// import { createContext, useContext, useState } from "react";

// const ApiContext = createContext();

// export const ApiProvider = ({ children }) => {
//   const [users, setUsers] = useState([]);
//   const [students, setStudents] = useState([]);

//   return (
//     <ApiContext.Provider value={{ users, setUsers, students, setStudents }}>
//       {children}
//     </ApiContext.Provider>
//   );
// };

// export const useApiContext = () => useContext(ApiContext);

// // app/components/users/UsersList.js
// import React, { useEffect } from "react";
// import useApi from "../../hooks/useApi";
// import { getUsers } from "../../api/users/getUsers";
// import { useApiContext } from "../../context/ApiContext";

// const UsersList = () => {
//   const { data, error, loading, execute } = useApi(getUsers);
//   const { setUsers } = useApiContext();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const users = await execute();
//       setUsers(users);
//     };
//     fetchUsers();
//   }, []);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div>
//       {data && data.map((user) => <div key={user.id}>{user.name}</div>)}
//     </div>
//   );
// };

// export default UsersList;
