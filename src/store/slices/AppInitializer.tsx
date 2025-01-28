// components/AppInitializer.tsx
"use client";
import { useEffect } from 'react';
import { useAppDispatch } from '../hook'; // Correct import path
import { initializeAuth } from './authSlice';

const AppInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return null;
};

export default AppInitializer;
