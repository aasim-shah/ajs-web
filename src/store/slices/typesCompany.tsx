// types.ts

export interface Contact {
    phone: string;
    isVerified: boolean;
  }
  
  export interface UserInfo {
    contact: Contact;
    email: string;
    role: string;
  }
  
  export interface SocialLinks {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  }
  
  export interface Job {
    _id: string;
    title: string;
    description: string;
  }
  
  export interface Company {
    _id: string;
    companyName: string;
    companyLogo: string;
    website: string;
    foundedYear: string;
    numberOfEmployees: string;
    sector: string;
    specialty?: string;
    city: string;
    province: string;
    country: string;
    address: string;
    description: string;
    services?: string[];
    skills?: string[];
    companyImages?: string[];
    socialLinks?: SocialLinks;
    userInfo?: UserInfo;
    languages?: string[];
    plan?: string;
    jobs?: Job[];
  }
  