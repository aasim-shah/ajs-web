"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { sendOTP, verifyOTP, googleSignIn } from '../../store/slices/authSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from 'next/navigation';

const SendOTPPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('sendOTP'); // 'sendOTP' or 'verifyOTP'
  const [role, setRole] = useState('jobSeeker'); // 'jobSeeker' or 'company'
  const router = useRouter();

  useEffect(() => {
    if (auth.user) {
      // Optionally, store tokens in local storage
      localStorage.setItem('accessToken', auth.accessToken || '');
      localStorage.setItem('refreshToken', auth.refreshToken || '');
      router.push('/');
    }
  }, [auth.user, router, auth.accessToken, auth.refreshToken]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
   

    if (code && state) {
      setRole(state);
      dispatch(googleSignIn({ code, role: state })).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          
        } else {
         
        }
      });
    }
  }, [dispatch]);

  const handleSendOTP = async () => {
    await dispatch(sendOTP({ email }));
    setStep('verifyOTP');
  };

  const handleVerifyOTP = async () => {
    await dispatch(verifyOTP({ email, otp }));
  };

  const handleGoogleSignIn = (selectedRole: string) => {
    setRole(selectedRole);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?role=${selectedRole}`;
  };

  return (
    <div className="md:flex">
      <div className="hidden md:flex md:w-1/2 w-full min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/signupimage.png')" }}>
      </div>
      <div className="md:w-1/2 w-full flex items-center justify-center min-h-screen py-8">
        <div className="w-[550px]">
          <Tabs defaultValue="jobseeker" className="w-full">
            <TabsList className="flex justify-center w-full mb-4">
              <TabsTrigger value="jobseeker" className="w-1/3" onClick={() => setRole('jobSeeker')}>Job Seeker</TabsTrigger>
              <TabsTrigger value="company" className="w-1/3" onClick={() => setRole('company')}>Company</TabsTrigger>
            </TabsList>
            <TabsContent value="jobseeker">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex mb-5 justify-center text-darkGrey md:text-3xl">
                    {step === 'sendOTP' ? 'Verify your email' : 'Enter OTP'}
                  </CardTitle>
                  <CardDescription>
                    <Button
                      className="w-full text-darkGrey"
                      variant="outline"
                      onClick={() => handleGoogleSignIn('jobSeeker')}
                    >
                      <FcGoogle size={25} className="mr-2" /> Sign In with Google
                    </Button>
                  </CardDescription>
                  <CardDescription>
                    <div className="flex items-center justify-center">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <Button variant="link" className="mx-4 text-signinemail">
                        Or {step === 'sendOTP' ? 'send OTP via email' : 'verify OTP'}
                      </Button>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {step === 'sendOTP' ? (
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-signininput text-base">Email Address</Label>
                      <Input
                        type="email"
                        id="email"
                        className="  text-signininput placeholder-signininput3 text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Label htmlFor="otp" className="text-signininput text-base">OTP</Label>
                      <Input
                        type="text"
                        id="otp"
                        className="text-signininput3 text-base"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                      />
                    </div>
                  )}
                  <div>
                    <Button
                      variant="outline"
                      size={"lg"}
                      className="bg-signature w-full text-background"
                      onClick={step === 'sendOTP' ? handleSendOTP : handleVerifyOTP}
                    >
                      {step === 'sendOTP' ? 'Send OTP' : 'Verify OTP'}
                    </Button>
                  </div>
                  {auth.error && <p className="text-red-500">{auth.error}</p>}
                  <div className="flex items-center">
                    <h1 className="text-signinemail text-base">Don’t have an account?</h1>
                    <Button asChild variant="link" className="text-signature">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="w-full text-signature">
                    <Link href="/home">
                      <FaArrowLeft size={20} className="mr-2" /> Back to Home
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="company">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex mb-5 justify-center text-darkGrey md:text-3xl">
                    {step === 'sendOTP' ? 'Verify your email' : 'Enter OTP'}
                  </CardTitle>
                  <CardDescription>
                    <Button
                      className="w-full text-darkGrey"
                      variant="outline"
                      onClick={() => handleGoogleSignIn('company')}
                    >
                      <FcGoogle size={25} className="mr-2" /> Sign In with Google
                    </Button>
                  </CardDescription>
                  <CardDescription>
                    <div className="flex items-center justify-center">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <Button variant="link" className="mx-4 text-signinemail">
                        Or {step === 'sendOTP' ? 'send OTP via email' : 'verify OTP'}
                      </Button>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {step === 'sendOTP' ? (
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-signininput text-base">Email Address</Label>
                      <Input
                        type="email"
                        id="email"
                        className="text-signininput3 text-base"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Label htmlFor="otp" className="text-signininput text-base">OTP</Label>
                      <Input
                        type="text"
                        id="otp"
                        className="text-signininput3 text-base"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                      />
                    </div>
                  )}
                  <div>
                    <Button
                      variant="outline"
                      size={"lg"}
                      className="bg-signature w-full text-background"
                      onClick={step === 'sendOTP' ? handleSendOTP : handleVerifyOTP}
                    >
                      {step === 'sendOTP' ? 'Send OTP' : 'Verify OTP'}
                    </Button>
                  </div>
                  {auth.error && <p className="text-red-500">{auth.error}</p>}
                  <div className="flex items-center">
                    <h1 className="text-signinemail text-base">Don’t have an account?</h1>
                    <Button asChild variant="link" className="text-signature">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="link" className="w-full text-signature">
                    <Link href="/home">
                      <FaArrowLeft size={20} className="mr-2" /> Back to Home
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SendOTPPage;
