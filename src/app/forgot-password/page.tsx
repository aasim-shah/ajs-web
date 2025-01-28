"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { sendForgotPasswordOTP, verifyOTP, resetPassword } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons
import { useRouter } from 'next/navigation';

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [timer, setTimer] = useState<number>(60);
  const [resendEnabled, setResendEnabled] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendEnabled(true);
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [step, timer]);

  const handleSendOTP = async () => {
    setMessage('');
    try {
      await dispatch(sendForgotPasswordOTP({ email })).unwrap();
      setStep(2);
      setTimer(60);
      setResendEnabled(false);
    } catch (error) {
      setMessage('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    setMessage('');
    try {
      await dispatch(verifyOTP({ email, otp })).unwrap();
      setStep(3);
    } catch (error) {
      setMessage('Invalid OTP. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    setMessage('');
    try {
      await dispatch(resetPassword({ email, otp, newPassword })).unwrap();
      setMessage('Password updated successfully. Redirecting to sign-in...');
      setTimeout(() => {
        router.push('/signin'); // Redirect to sign-in page
      }, 2000);
    } catch (error) {
      setMessage('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="md:flex">
      <div
        className="hidden md:flex md:w-1/2 w-full min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/signupimage.png')" }}
      ></div>
      <div className="md:w-1/2 w-full flex items-center justify-center min-h-screen py-8">
        <div className="w-[400px]">
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-center text-darkGrey md:text-3xl">
                {step === 1 && 'Forgot Password'}
                {step === 2 && 'Verify OTP'}
                {step === 3 && 'Reset Password'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {message && (
                <p className={`text-center ${message.includes('successfully') ? 'text-greenprogress' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
              {step === 1 && (
                <>
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
                  <div>
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-signature w-full text-background"
                      onClick={handleSendOTP}
                    >
                      Send OTP
                    </Button>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
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
                  <div>
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-signature w-full text-background"
                      onClick={handleVerifyOTP}
                    >
                      Verify OTP
                    </Button>
                  </div>
                  {resendEnabled ? (
                    <Button
                      variant="link"
                      className="text-signature"
                      onClick={handleSendOTP}
                    >
                      Resend OTP
                    </Button>
                  ) : (
                    <p className="text-center text-gray-500">
                      Resend OTP in {timer} seconds
                    </p>
                  )}
                </>
              )}
              {step === 3 && (
                <>
                  <div className="space-y-1 relative">
                    <Label htmlFor="newPassword" className="text-signininput text-base">New Password</Label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        className="text-signininput3 text-base w-full pr-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                      <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                      >
                        {showNewPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 relative">
                    <Label htmlFor="confirmPassword" className="text-signininput text-base">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        className="text-signininput3 text-base w-full pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                      <div
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-signature w-full text-background"
                      onClick={handleResetPassword}
                    >
                      Reset Password
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
