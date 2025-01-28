"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";

import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Don't forget to import the CSS

import {
  updateCompanyProfile,
  addOrUpdateCompanyLogo,
  addOrUpdateCompanyImages,
  fetchCompanyProfile,
} from "@/store/slices/companyProfileSlice/companyProfileSlice";

export type CompanyFormData = {
  companyName: string;
  companySize: string;
  foundedYear: string;
  companyDescription: string;
  sector: string;
  services: string[];
  languages: string[];
  websiteUrl: string;
  // contactNumber: string;
  email: string;
  country: string;
  province: string;
  city: string;
  address: string;
  companyLogo: File | null;
  companyImages: File[];
  // mediaUrl: string;
};

const MultiStepForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([false, false, false]);
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: "",
    companySize: "",
    foundedYear: "",
    companyDescription: "",
    websiteUrl: "",
    // contactNumber: "",
    email: "",
    country: "",
    province: "",
    city: "",
    address: "",
    sector: "",
    services: [],
    languages: [],
    companyLogo: null,
    companyImages: [],
    // mediaUrl: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const companyId =
    typeof window !== "undefined" ? localStorage.getItem("_id") : null;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token || !companyId) return;

      try {
        const company = await dispatch(fetchCompanyProfile(companyId)).unwrap();
        setFormData((prev) => ({
          ...prev,
          companyName: company.companyName,
          companySize: company.numberOfEmployees,
          foundedYear: company.foundedYear,
          companyDescription: company.description || "",
          sector: company.sector || "",
          services: company.services || [],
          languages: company.languages || [],
          websiteUrl: company.website || "",
          // contactNumber: company.phone || "",
          email: company.userInfo.email,
          country: company.country || "",
          province: company.province || "",
          city: company.city || "",
          address: company.address || "",
          companyLogo: null,
          companyImages: [],
        }));
      } catch (error) {
        console.error("Failed to fetch company profile", error);
      }
    };

    fetchProfile();
  }, [dispatch, token, companyId]);

  const nextStep = () => {
    // if (validateStep()) {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[step - 1] = true;
    setCompletedSteps(newCompletedSteps);
    setStep(step + 1);
    // }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submitForm = async () => {
    if (!token || !companyId) return;

    try {
      // Update company profile details
      await dispatch(
        updateCompanyProfile({
          id: companyId,
          updates: {
            companyName: formData.companyName,
            numberOfEmployees: formData.companySize?.toString(),
            foundedYear: formData.foundedYear?.toString(),
            sector: formData.sector,
            services: formData.services,
            description: formData.companyDescription,
            website: formData.websiteUrl,
            email: formData.email,
            country: formData.country,
            province: formData.province,
            city: formData.city,
            address: formData.address,
            languages: formData.languages,
          },
          token: token,
        })
      ).unwrap();

      // Update company logo
      if (formData.companyLogo) {
        const logoFormData = new FormData();
        logoFormData.append("companyLogo", formData.companyLogo);
        await dispatch(
          addOrUpdateCompanyLogo({
            companyId: companyId,
            logo: logoFormData,
            token: token,
          })
        ).unwrap();
      }

      // Update company images
      if (formData.companyImages.length > 0) {
        await dispatch(
          addOrUpdateCompanyImages({
            companyId: companyId,
            images: formData.companyImages,
            token: token,
          })
        ).unwrap();
      }

      router.push("/dashboard/company-profile");
    } catch (error: any) {
      console.log({ error });
      // if (error.errors) {
      //   const errorObject: { [key: string]: string } = {};
      //   error.errors.forEach((err: any) => {
      //     errorObject[err.path] = err.message;
      //   });
      //   setErrors(errorObject);
      // } else {
      //   console.error(error);
      // }

      if (error) {
        // Loop through each error and display a toast
        error.forEach((err: any) => {
          toast.error(`${err.path}: ${err.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        });

        const errorObject: { [key: string]: string } = {};
        error.forEach((err: any) => {
          errorObject[err.path] = err.message;
        });
        setErrors(errorObject);
      } else {
        console.error(error);
      }
    }
  };

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 1:
        if (!formData.companyName)
          newErrors.companyName = "Company name cannot be empty";
        if (!formData.companySize) {
          newErrors.companySize = "Company size cannot be empty";
        } else if (isNaN(parseInt(formData.companySize, 10))) {
          newErrors.companySize = "Company size must be a number";
        }
        if (!formData.foundedYear) {
          newErrors.foundedYear = "Founded year cannot be empty";
        } else if (isNaN(parseInt(formData.foundedYear, 10))) {
          newErrors.foundedYear = "Founded year must be a number";
        }
        if (!formData.companyDescription)
          newErrors.companyDescription = "Company description cannot be empty";
        if (!formData.sector) newErrors.sector = "Sector cannot be empty";
        if (!formData.services.length)
          newErrors.services = "Services cannot be empty";
        if (!formData.languages.length)
          newErrors.languages = "Languages cannot be empty";
        break;
      case 2:
        if (!formData.websiteUrl) {
          newErrors.websiteUrl = "Website URL cannot be empty";
        } else {
          const urlPattern = new RegExp(
            "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[--a-z\\d_]*)?$",
            "i"
          );
          if (!urlPattern.test(formData.websiteUrl)) {
            newErrors.websiteUrl = "Website should be a valid URL";
          }
        }
        // if (!formData.contactNumber) {
        //   newErrors.contactNumber = "Contact number cannot be empty";
        // } else if (isNaN(parseInt(formData.contactNumber, 10))) {
        //   newErrors.contactNumber = "Contact number must be a number";
        // }
        if (!formData.email) newErrors.email = "Email cannot be empty";
        if (!formData.country) newErrors.country = "Country cannot be empty";
        if (!formData.province) newErrors.province = "Province cannot be empty";
        if (!formData.city) newErrors.city = "City cannot be empty";
        if (!formData.address) newErrors.address = "Address cannot be empty";
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="relative">
      <ToastContainer />

      <div className="absolute hidden md:block right-0 bottom-0">
        <Image src="/images/tree.png" alt="logo" width={200} height={200} />
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col sm:flex-row justify-between border mb-8">
          <div className={`flex-1 flex justify-center items-center gap-2 py-2`}>
            <div
              className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center ${
                step === 1
                  ? "bg-signature text-background"
                  : completedSteps[0]
                  ? "bg-signature"
                  : "bg-secondary text-custom-gray-blue"
              }`}
            >
              {completedSteps[0] && step !== 1 ? (
                <FaCheck className="w-4 sm:w-5 h-4 sm:h-5 text-background" />
              ) : (
                <img
                  src="/images/companydetails.svg"
                  alt="Step 1"
                  className="w-6 sm:w-7 h-6 sm:h-7"
                />
              )}
            </div>
            <div className="mt-2 text-center">
              <h1
                className={`text-sm sm:text-base ${
                  step === 1 ? "text-signature" : ""
                }`}
              >
                Step 1/3
              </h1>
              <h1 className="text-xs sm:text-sm text-black">Company Details</h1>
            </div>
          </div>
          <div className={`flex-1 flex justify-center items-center gap-2 py-2`}>
            <div
              className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center ${
                step === 2
                  ? "bg-signature text-background"
                  : completedSteps[1]
                  ? "bg-signature"
                  : "bg-secondary text-custom-gray-blue"
              }`}
            >
              {completedSteps[1] && step !== 2 ? (
                <FaCheck className="w-4 sm:w-5 h-4 sm:h-5 text-background" />
              ) : (
                <img
                  src="/images/phone.svg"
                  alt="Step 2"
                  className="w-6 sm:w-7 h-6 sm:h-7"
                />
              )}
            </div>
            <div className="mt-2 text-center">
              <h1
                className={`text-sm sm:text-base ${
                  step === 2 ? "text-signature" : ""
                }`}
              >
                Step 2/3
              </h1>
              <h1 className="text-xs sm:text-sm text-black">Contact Details</h1>
            </div>
          </div>
          <div className={`flex-1 flex justify-center items-center gap-2 py-2`}>
            <div
              className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center ${
                step === 3
                  ? "bg-signature text-background"
                  : completedSteps[2]
                  ? "bg-signature"
                  : "bg-secondary text-custom-gray-blue"
              }`}
            >
              {completedSteps[2] && step !== 3 ? (
                <FaCheck className="w-4 sm:w-5 h-4 sm:h-5 text-background" />
              ) : (
                <img
                  src="/images/notes.svg"
                  alt="Step 3"
                  className="w-6 sm:w-7 h-6 sm:h-7"
                />
              )}
            </div>
            <div className="mt-2 text-center">
              <h1
                className={`text-sm sm:text-base ${
                  step === 3 ? "text-signature" : ""
                }`}
              >
                Step 3/3
              </h1>
              <h1 className="text-xs sm:text-sm text-black">Company Media</h1>
            </div>
          </div>
        </div>
        {step === 1 && (
          <Step1
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            submitForm={submitForm}
            errors={errors}
          />
        )}
        {step === 2 && (
          <Step2
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            submitForm={submitForm}
            errors={errors}
          />
        )}
        {step === 3 && (
          <Step3
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            submitForm={submitForm}
            errors={errors}
          />
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
