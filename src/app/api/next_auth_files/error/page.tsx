// app/auth/error/page.tsx

"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ErrorPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }, [router]);

  return <p>An error occurred. Redirecting to home page...</p>;
};

export default ErrorPage;
