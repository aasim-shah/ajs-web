"use client";

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { RootState } from '../store';

interface ProtectedRouteProps {
  children: ReactNode;
  accessibleWithoutAuth?: boolean;
}

const ProtectedRoute = ({ children, accessibleWithoutAuth = false }: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (!user && !accessibleWithoutAuth) {
      router.push('/signin');
    }
  }, [user, accessibleWithoutAuth, router]);

  if (!user && !accessibleWithoutAuth) {
    return null; // Or a loading spinner or message
  }

  return <>{children}</>;
};

export default ProtectedRoute;
