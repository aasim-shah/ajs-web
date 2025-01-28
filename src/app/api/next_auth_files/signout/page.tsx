// app/auth/signout/page.tsx

"use client";
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

const SignOutPage: React.FC = () => {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);

  return <p>Signing out...</p>;
};

export default SignOutPage;
