import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';

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
  languages?: string[];
}

interface CompanyDialogProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

const CompanyDialog: React.FC<CompanyDialogProps> = ({ company, isOpen, onClose }) => {
  if (!company) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-screen overflow-y-auto p-6">
        <DialogHeader className="flex justify-between items-start mb-4">
          <DialogTitle className="text-2xl font-bold">{company.companyName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-300 mb-2">
            {company.companyLogo ? (
              <Image src={company.companyLogo} alt={company.companyName} layout="fill" objectFit="cover" />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-full"></div>
            )}
          </div>
          <p className="mb-4 text-center text-gray-700">{company.description || "No description available"}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
          <div>
            <h3 className="font-bold">Sector:</h3>
            <p>{company.sector || "N/A"}</p>
          </div>
          <div>
            <h3 className="font-bold">Location:</h3>
            <p>{[company.city, company.province, company.country].filter(Boolean).join(', ') || "N/A"}</p>
          </div>
          <div>
            <h3 className="font-bold">Website:</h3>
            <p>
              {company.website ? (
                <a href={`http://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {company.website}
                </a>
              ) : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="font-bold">Founded:</h3>
            <p>{company.foundedYear ? new Date(company.foundedYear).getFullYear() : 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-bold">Number of Employees:</h3>
            <p>{company.numberOfEmployees || "N/A"}</p>
          </div>
          <div>
            <h3 className="font-bold">Services:</h3>
            <ul className="list-disc pl-5">
              {company.services?.length ? company.services.map((service, index) => (
                <li key={index}>{service}</li>
              )) : "N/A"}
            </ul>
          </div>
          <div>
            <h3 className="font-bold">Languages:</h3>
            <ul className="list-disc pl-5">
              {company.languages?.length ? company.languages.map((language, index) => (
                <li key={index}>{language}</li>
              )) : "N/A"}
            </ul>
          </div>
          <div className="col-span-2">
            <h3 className="font-bold">Address:</h3>
            <p>{company.address || "N/A"}</p>
          </div>
        </div>
        <div className="w-full flex justify-center mt-6">
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDialog;
