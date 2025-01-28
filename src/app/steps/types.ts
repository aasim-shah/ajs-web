// types.ts

export type CompanyFormData = {
    companyName: string;
    companySize: string;
    foundedYear: string;
    companyDescription: string;
    sector: string;
    services: string[];
    languages: string[];
    websiteUrl: string;
    contactNumber: string;
    email: string;
    country: string;
    province: string;
    city: string;
    address: string;
    companyLogo: File | null;
    companyImages: File[];
    mediaUrl: string;
  };
  