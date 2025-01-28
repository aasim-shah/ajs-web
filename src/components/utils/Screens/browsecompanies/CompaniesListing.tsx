import React, { useState } from "react";
import { MdGridView } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useCommonData } from "@/context/commonData";
import CompanyCard from "@/components/CompanyCard";

interface Job {
  _id: string;
  title: string;
  description: string;
}

interface Company {
  _id: string;
  companyName: string;
  companyLogo?: string;
  website?: string;
  foundedYear?: string;
  numberOfEmployees?: string;
  sector?: string;
  city?: string;
  province?: string;
  country?: string;
  address?: string;
  description?: string;
  services?: string[];
  companyImages?: string[];
  totalJobs?: number;
  plan?: string;
  jobs?: Job[];
}

interface CompanyListingsProps {
  companies: Company[];
  searchTerm: string;
  location: string;
}

const CompanyListings: React.FC<CompanyListingsProps> = ({
  companies,
  searchTerm,
  location,
}) => {
  const { gridView, toggleGridView } = useCommonData();
  const router = useRouter();

  const filteredJobs = companies.filter((company) => {
    const matchesSearchTerm = company.companyName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearchTerm;
  });

  const handleCardClick = (id: string) => {
    router.push(`/company-profile/${id}`);
  };

  return (
    <div className="md:w-full p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="lg:text-3xl md:text-2xl text-md font-bold">
            Suggested Companies
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm md:text-lg">Sort by: </p>
          </div>
          <div>
            <Accordion
              type="single"
              collapsible
              className="w-full text-sm md:text-lg"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>Most relevant</AccordionTrigger>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="h-5 border border-foreground hidden md:block"></div>
          <div
            className="hidden md:block cursor-pointer"
            onClick={toggleGridView}
          >
            <MdGridView />
          </div>
        </div>
      </div>
      <div className="md:mb-10 text-sm mb-4 md:text-lg">
        <p>Showing {filteredJobs.length} results</p>
      </div>

      <div className={gridView ? "grid grid-cols-1 md:grid-cols-2 gap-5" : ""}>
        {companies.map((company: Company) => {
          return (
            <CompanyCard
              key={company._id}
              company={company}
              gridView={gridView}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CompanyListings;
