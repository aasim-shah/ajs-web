"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  signInJobSeeker,
  signInCompany,
  clearErrors,
} from "../../store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";

interface AuthError {
  path: string;
  message: string;
}

const HandleSearchParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const role = searchParams.get("role");
    if (role) {
      router.push(role === "company" ? "/dashboard/company-admin-panel" : "/");
    }
  }, [searchParams, router]);

  return null;
};

const SignInPage: React.FC = () => {
  const [userType, setUserType] = useState("jobSeeker");
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    const showToast = () => {
      const storedError = localStorage.getItem("authError");
      if (storedError) {
        toast({
          description: storedError,
          duration: 10000,
          className: "bg-red-500 text-background",
        });
        localStorage.removeItem("authError");
      }
    };

    setTimeout(showToast, 2000);

    const error = searchParams.get("error");
    if (error) {
      const decodedError = decodeURIComponent(error);
      localStorage.setItem("authError", decodedError);
    }
  }, [searchParams, toast]);

  useEffect(() => {
    // Load the credentials based on the selected user type
    const loadCredentials = () => {
      const savedEmail = localStorage.getItem(`${userType}_email`);
      const savedPassword = localStorage.getItem(`${userType}_password`);
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      } else {
        setEmail("");
        setPassword("");
        setRememberMe(false);
      }
    };

    loadCredentials();
  }, [userType]);

  useEffect(() => {
    if (auth?.user && !roleError) {
      const role = auth.role;
      if (role === "company") {
        router.push("/dashboard");
      } else if (role === "jobSeeker") {
        router.push("/");
      }
    }
  }, [auth?.user, auth.role, roleError, router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async () => {
    dispatch(clearErrors());
    setRoleError(null);
    try {
      let action;
      if (userType === "jobSeeker") {
        action = signInJobSeeker;
      } else if (userType === "company") {
        action = signInCompany;
      }

      if (action) {
        const response = await dispatch(action({ email, password })).unwrap();

        if (response.role !== userType) {
          setRoleError("Unauthorized: role mismatch");
          return;
        }

        if (rememberMe) {
          localStorage.setItem(`${userType}_email`, email);
          localStorage.setItem(`${userType}_password`, password);
        } else {
          localStorage.removeItem(`${userType}_email`);
          localStorage.removeItem(`${userType}_password`);
        }

        if (response) {
          if (userType === "company") {
            router.push("/dashboard/company-admin-panel");
          } else {
            router.push("/");
          }
        }
      } else {
        console.error("Invalid userType or action is undefined");
      }
    } catch (error) {
      // Errors are already handled in the Redux slice
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?role=${userType}`;
  };

  const getErrorMessage = (field: string): string | null => {
    const error = auth.errors.find((error: AuthError) => error.path === field);
    return error ? error.message : null;
  };

  const handleGoogleSignInnn = async () => {
    try {
      // Trigger Google sign-in
      const response = await signIn("google", { redirect: false });
      console.log({ googleREsponse: response });

      if (response?.ok) {
        const session = await fetch("/api/auth/session").then((res) =>
          res.json()
        );

        // Extract idToken or accessToken and send it to the backend
        const { idToken, accessToken, profile } = session;

        // Send the Google ID token or access token to your backend for verification

        console.log("Successfully sent Google token to backend");
      } else {
        console.error("Google sign-in failed");
      }
    } catch (error) {
      console.error(
        "Error during Google sign-in or token transmission:",
        error
      );
    }
  };

  return (
    <div className="md:flex">
      <HandleSearchParams />
      <div
        className="hidden md:flex md:w-1/2 w-full min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/signupimage.png')" }}
      ></div>
      <div className="md:w-1/2 w-full flex items-center justify-center min-h-screen py-8">
        <div className="w-[550px]">
          <Tabs
            defaultValue="jobSeeker"
            className="w-full"
            onValueChange={(value) => setUserType(value)}
          >
            <TabsList className="flex justify-center w-full mb-4">
              <TabsTrigger value="jobSeeker" className="w-1/3">
                Job Seeker
              </TabsTrigger>
              <TabsTrigger value="company" className="w-1/3">
                Company
              </TabsTrigger>
            </TabsList>
            <TabsContent value="jobSeeker">
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex mb-5 justify-center text-darkGrey md:text-3xl">
                    Get more opportunities
                  </CardTitle>
                  <CardDescription>
                    <Button
                      className="w-full text-darkGrey"
                      variant="outline"
                      onClick={handleGoogleSignIn}
                    >
                      <FcGoogle size={25} className="mr-2" /> Sign In with
                      Google
                    </Button>
                  </CardDescription>
                  <CardDescription>
                    <div className="flex items-center justify-center">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <Button
                        asChild
                        variant="link"
                        className="mx-4 text-signinemail"
                      >
                        <Link href={`/send-otp?role=${userType}`}>
                          Or Sign In with email
                        </Link>
                      </Button>

                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-1">
                    <Label
                      htmlFor="email"
                      className="text-signininput text-base"
                    >
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      className="text-signininput placeholder-signininput3 text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                    {getErrorMessage("email") && (
                      <span className="text-red-500">
                        {getErrorMessage("email")}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 relative">
                    <Label
                      htmlFor="password"
                      className="text-signininput text-base"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="text-signininput placeholder-signininput3 text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center top-5 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    {getErrorMessage("password") && (
                      <span className="text-red-500">
                        {getErrorMessage("password")}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm signininput font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Button asChild variant="link" className="text-signature">
                        <Link href="/forgot-password">Forgot Password?</Link>
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size={"lg"}
                      className="bg-signature w-full text-background"
                      onClick={handleSignIn}
                      disabled={auth.status === "loading"}
                    >
                      Continue
                    </Button>
                  </div>
                  {auth.errors.length > 0 && (
                    <div className="mt-4">
                      {auth.errors
                        .filter((error: AuthError) => error.path === "unknown")
                        .map((error: AuthError, index: number) => (
                          <p key={index} className="text-red-500">
                            {error.message}
                          </p>
                        ))}
                    </div>
                  )}
                  {roleError && (
                    <div className="mt-4">
                      <p className="text-red-500">{roleError}</p>
                    </div>
                  )}
                  <div className="flex items-center">
                    <h1 className="text-signinemail text-base">
                      Don’t have an account?
                    </h1>
                    <Button asChild variant="link" className="text-signature">
                      <Link href={`/send-otp?role=${userType}`}>Sign Up</Link>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    variant="link"
                    className="w-full text-signature"
                  >
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
                    Find the best talent
                  </CardTitle>
                  <CardDescription>
                    <Button
                      className="w-full text-darkGrey"
                      variant="outline"
                      // onClick={handleGoogleSignIn}
                      // onClick={handleGoogleSignIn}
                      // onClick={() => {
                      //   signIn("google");
                      // }}
                      onClick={handleGoogleSignInnn}
                    >
                      <FcGoogle size={25} className="mr-2" /> Sign In with
                      Google
                    </Button>
                    {roleError && (
                      <p className="text-center mt-4 text-red-500">
                        {roleError}
                      </p>
                    )}
                  </CardDescription>
                  <CardDescription>
                    <div className="flex items-center justify-center">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <Button
                        asChild
                        variant="link"
                        className="mx-4 text-signinemail"
                      >
                        <Link href={`/send-otp?role=${userType}`}>
                          Or Sign In with email
                        </Link>
                      </Button>

                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-1">
                    <Label
                      htmlFor="email"
                      className="text-signininput text-base"
                    >
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      className="text-signininput placeholder-signininput3 text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                    {getErrorMessage("email") && (
                      <span className="text-red-500">
                        {getErrorMessage("email")}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 relative">
                    <Label
                      htmlFor="password"
                      className="text-signininput text-base"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="text-signininput placeholder-signininput3 text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                    />
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center top-5 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                    {getErrorMessage("password") && (
                      <span className="text-red-500">
                        {getErrorMessage("password")}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                          setRememberMe(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm signininput font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Button asChild variant="link" className="text-signature">
                        <Link href="/forgot-password">Forgot Password?</Link>
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size={"lg"}
                      className="bg-signature w-full text-background"
                      onClick={handleSignIn}
                      disabled={auth.status === "loading"}
                    >
                      Continue
                    </Button>
                  </div>
                  {auth.errors.length > 0 && (
                    <div className="mt-4">
                      {auth.errors
                        .filter((error: AuthError) => error.path === "unknown")
                        .map((error: AuthError, index: number) => (
                          <p key={index} className="text-red-500">
                            {error.message}
                          </p>
                        ))}
                    </div>
                  )}
                  {roleError && (
                    <div className="mt-4">
                      <p className="text-red-500">{roleError}</p>
                    </div>
                  )}
                  <div className="flex items-center">
                    <h1 className="text-signinemail text-base">
                      Don’t have an account?
                    </h1>
                    <Button asChild variant="link" className="text-signature">
                      <Link href={`/send-otp?role=${userType}`}>Sign Up</Link>
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    variant="link"
                    className="w-full text-signature"
                  >
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

export default SignInPage;
