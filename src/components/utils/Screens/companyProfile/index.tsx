"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  fetchCompanyById,
  fetchJobsByCompany,
} from "@/store/slices/companySlice";
import { RootState, AppDispatch } from "@/store";
import ProfileCompletion from "./components/ProfileCompletion";
import AdditionalDetail from "./components/AdditionalDetail";
import AboutMe from "./components/Description";
import Projects from "./components/CompanyImages";
import Skills from "./components/Skills";
import SocialLinks from "./components/SocialLinks";
import Title from "@/components/Title";
import Services from "./components/Services";
import Specialization from "./components/Specialization";
import CompanyJobs from "./components/CompanyJobs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

const CompanyProfile = () => {
  const dispatch: AppDispatch = useDispatch();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id) {
      dispatch(fetchCompanyById(id));
      dispatch(fetchJobsByCompany(id));
    }
  }, [id, dispatch]);

  const { selectedCompany, jobs, status, error } = useSelector(
    (state: RootState) => state.company
  );

  if (!id) {
    return <div>No ID provided in URL.</div>;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!selectedCompany) {
    return <div>No company data available.</div>;
  }

  const specialtyArray: string[] = Array.isArray(selectedCompany.specialty)
    ? selectedCompany.specialty
    : selectedCompany.specialty
    ? [selectedCompany.specialty]
    : [];

  return (
    <Title
      title="Company Profile"
      className="w-full min-h-screen flex flex-col bg-background p-4"
    >
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/browsecompanies">Companies</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{selectedCompany.companyName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="md:flex px-4 py-5 md:gap-10">
        <div className="md:w-2/3 w-full">
          <ProfileCompletion company={selectedCompany} />

          {selectedCompany.description && (
            <div className="my-10">
              <AboutMe description={selectedCompany.description} />
            </div>
          )}

          {selectedCompany.services && selectedCompany.services.length > 0 && (
            <div className="my-10">
              <Services services={selectedCompany.services} />
            </div>
          )}

          {specialtyArray.length > 0 && (
            <div className="my-10">
              <Specialization specialty={specialtyArray} />
            </div>
          )}

          {selectedCompany.skills && selectedCompany.skills.length > 0 && (
            <div className="my-10">
              <Skills skills={selectedCompany.skills} />
            </div>
          )}

          {selectedCompany.companyImages &&
            selectedCompany.companyImages.length > 0 && (
              <div className="my-10">
                <Projects companyImages={selectedCompany.companyImages} />
              </div>
            )}

          {jobs && jobs.length > 0 ? (
            <div className="my-10">
              <CompanyJobs jobs={jobs} />
            </div>
          ) : (
            <div>No jobs found for this company.</div>
          )}
        </div>

        <div className="md:w-1/3 w-full">
          {selectedCompany.userInfo && (
            <AdditionalDetail
              userInfo={selectedCompany.userInfo}
              languages={selectedCompany.languages || []}
              city={selectedCompany.city}
              province={selectedCompany.province}
              country={selectedCompany.country}
              address={selectedCompany.address}
            />
          )}

          {selectedCompany.socialLinks && (
            <div className="my-10">
              <SocialLinks socialLinks={selectedCompany.socialLinks} />
            </div>
          )}
        </div>
      </div>
    </Title>
  );
};

export default CompanyProfile;
