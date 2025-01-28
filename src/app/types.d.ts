interface Pagination {
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  }
  
  type Tab = "active" | "in-review" | "interviewing" | "completed";


  interface Job {
    _id: string;
    title: string;
    sector: string;
    skills: string[];
    country: string;
    city: string;
    province: string;
    description: string;
    benefits: string[];
    salary: {
      from: number;
      to: number;
    };
    availability: string;
    careerLevel: string;
    jobType: string;
    candidateType: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    workPermitNeeded: boolean;
  }