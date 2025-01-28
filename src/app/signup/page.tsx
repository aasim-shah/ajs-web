"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  registerJobSeeker,
  registerCompany,
  clearErrors,
} from "../../store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa6";

interface AuthError {
  path: string;
  message: string;
}

const SignUpForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string>(searchParams.get("email") || "");
  const [otp, setOtp] = useState<string>(searchParams.get("otp") || "");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [role, setRole] = useState<string>(searchParams.get("role") || "jobSeeker"); // Read role from URL
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      setShowCompletionModal(true);
    }
  }, [auth?.user]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (role === "jobSeeker") {
      if (!firstName) {
        errors.firstName = "First name cannot be empty";
      } else if (firstName.length < 3 || /[^a-zA-Z\s]/.test(firstName)) {
        errors.firstName =
          "First name must contain only letters and be at least 3 characters long";
      }

      if (!lastName) {
        errors.lastName = "Last name cannot be empty";
      } else if (lastName.length < 3 || /[^a-zA-Z\s]/.test(lastName)) {
        errors.lastName =
          "Last name must contain only letters and be at least 3 characters long";
      }
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.email = "Email cannot be empty";
    } else if (!emailPattern.test(email)) {
      errors.email = "Invalid email address";
    }

    if (!password) {
      errors.password = "Password cannot be empty";
    } else {
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordPattern.test(password)) {
        errors.password =
          "Password must be at least 8 characters long, contain uppercase, lowercase, number, and special character";
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password cannot be empty";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (role === "company" && !companyName) {
      errors.companyName = "Company name cannot be empty";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    setErrorMessage(null); // Clear previous error messages
    dispatch(clearErrors()); // Clear any previous errors from the Redux state

    if (!validateForm()) {
      return;
    }

    try {
      let response;
      if (role === "jobSeeker") {
        response = await dispatch(
          registerJobSeeker({ email, password, firstName, lastName, otp, role })
        ).unwrap();
      } else if (role === "company") {
        response = await dispatch(
          registerCompany({ email, password, otp, role, companyName })
        ).unwrap();
      }

      if (response) {
        localStorage.setItem("role", role); // Store the role in localStorage
        localStorage.setItem("_id", response._id); // Store user ID in localStorage
      }
    } catch (error: any) {
      if (Array.isArray(error)) {
        setErrorMessage(
          error
            .map((err: AuthError) => `${err.path}: ${err.message}`)
            .join(", ")
        );
      } else {
        setErrorMessage(
          error.message || "An error occurred during registration."
        );
      }
    }
  };

  const handleProfileCompletionChoice = (choice: "complete" | "skip") => {
    if (role === "company") {
      router.push(choice === "complete" ? "/steps" : "/dashboard/company-admin-panel");
    } else {
      router.push(
        choice === "complete" ? "/myprofile" : "/"
      );
    }
  }; 

  const getErrorMessage = (field: string): string | null => {
    const error = auth.errors.find((error: AuthError) => error.path === field);
    return error ? error.message : validationErrors[field] || null;
  };

  return (
    <div className="md:flex">
      <div
        className="hidden md:flex md:w-1/2 w-full min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/signupimage.png')" }}
      ></div>
      <div className="md:w-1/2 w-full flex items-center justify-center min-h-screen py-8">
        <div className="w-[550px]">
          <Tabs
            defaultValue={role} // Set the default tab based on the role from URL
            className="w-full"
            onValueChange={setRole}
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
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-1">
                    <Label
                      htmlFor="firstName"
                      className="text-signininput text-base"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      className="text-signininput3"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                    />
                    {getErrorMessage("firstName") && (
                      <span className="text-red-500">
                        {getErrorMessage("firstName")}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="lastName"
                      className="text-signininput text-base"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      className="text-signininput3"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                    />
                    {getErrorMessage("lastName") && (
                      <span className="text-red-500">
                        {getErrorMessage("lastName")}
                      </span>
                    )}
                  </div>
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
                      className="text-signininput3 text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      disabled // Make the email field non-editable
                    />
                    {getErrorMessage("email") && (
                      <span className="text-red-500">
                        {getErrorMessage("email")}
                      </span>
                    )}
                  </div>

                  {/* eye start */}

                  <div className="space-y-1 relative">
                    <Label
                      htmlFor="password"
                      className="text-signininput text-base"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="text-signininput3 text-base w-full pr-10" // Ensure full width and padding
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                      />
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <FaEye size={20} />
                        ) : (
                          <FaEyeSlash size={20} />
                        )}
                      </div>
                    </div>
                    {getErrorMessage("password") && (
                      <span className="text-red-500 text-sm mt-1">
                        {getErrorMessage("password")}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 relative">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-signininput text-base"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        className="text-signininput3 text-base w-full pr-10" // Ensure full width and padding
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                      />
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <FaEye size={20} />
                        ) : (
                          <FaEyeSlash size={20} />
                        )}
                      </div>
                    </div>
                    {getErrorMessage("confirmPassword") && (
                      <span className="text-red-500 text-sm mt-1">
                        {getErrorMessage("confirmPassword")}
                      </span>
                    )}
                  </div>

                  {/* eyee end */}

                  <div>
                    <Button
                      variant="outline"
                      size={"lg"}
                      className="bg-signature w-full text-background"
                      onClick={handleSignUp}
                      disabled={auth.status === "loading"}
                    >
                      Continue
                    </Button>
                  </div>
                  {errorMessage && (
                    <p className="text-red-500">{errorMessage}</p>
                  )}
                  <div className="flex items-center">
                    <h1 className="text-signinemail text-base">
                      Already have an account?
                    </h1>
                    <Button asChild variant="link" className="text-signature">
                      <Link href="/signin">Login</Link>
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <h1 className="text-signininput4 text-base">
                      By clicking &apos;Continue&apos;, you acknowledge that you
                      have read and accept the{" "}
                      <span className="text-signature">Terms of Service</span>{" "}
                      and <span className="text-signature">Privacy Policy</span>
                      .
                    </h1>
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
                    Get more opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-1">
                    <Label
                      htmlFor="companyName"
                      className="text-signininput text-base"
                    >
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      className="text-signininput3"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                    />
                    {getErrorMessage("companyName") && (
                      <span className="text-red-500">
                        {getErrorMessage("companyName")}
                      </span>
                    )}
                  </div>
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
                      className="text-signininput3 text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      disabled // Make the email field non-editable
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
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="text-signininput3 text-base w-full pr-10" // Ensure full width and padding
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                      />
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <FaEye size={20} />
                        ) : (
                          <FaEyeSlash size={20} />
                        )}
                      </div>
                    </div>
                    {getErrorMessage("password") && (
                      <span className="text-red-500 text-sm mt-1">
                        {getErrorMessage("password")}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 relative">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-signininput text-base"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        className="text-signininput3 text-base w-full pr-10" // Ensure full width and padding
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                      />
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <FaEye size={20} />
                        ) : (
                          <FaEyeSlash size={20} />
                        )}
                      </div>
                    </div>
                    {getErrorMessage("confirmPassword") && (
                      <span className="text-red-500 text-sm mt-1">
                        {getErrorMessage("confirmPassword")}
                      </span>
                    )}
                  </div>

                  <div>
                    <Button
                      variant="outline"
                      size={"lg"}
                      className="bg-signature w-full text-background"
                      onClick={handleSignUp}
                      disabled={auth.status === "loading"}
                    >
                      Continue
                    </Button>
                  </div>
                  {errorMessage && (
                    <p className="text-red-500">{errorMessage}</p>
                  )}
                  <div className="flex items-center">
                    <h1 className="text-signinemail text-base">
                      Already have an account?
                    </h1>
                    <Button asChild variant="link" className="text-signature">
                      <Link href="/signin">Login</Link>
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <h1 className="text-signininput4 text-base">
                      By clicking &apos;Continue&apos;, you acknowledge that you
                      have read and accept the{" "}
                      <span className="text-signature">Terms of Service</span>{" "}
                      and <span className="text-signature">Privacy Policy</span>
                      .
                    </h1>
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

      {showCompletionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-foreground bg-opacity-50">
          <div className="bg-background p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Complete Your Profile</h2>
            <p className="mb-4">
              Would you like to complete your profile now or skip for later?
            </p>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleProfileCompletionChoice("complete")}
              >
                Complete Now
              </Button>
              <Button
                variant="outline"
                onClick={() => handleProfileCompletionChoice("skip")}
              >
                Skip for Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SignUpPage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SignUpForm />
  </Suspense>
);

export default SignUpPage;
