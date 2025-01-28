import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { fetchBestMatchedJobs } from "@/store/slices/jobSlice";
import { RootState, AppDispatch } from "@/store";
import { Job } from "@/store/slices/types";
import Image from "next/image";
import { toggleSaveJob, fetchJobById, getSavedJobs } from "@/store/slices/jobSeekerSlice";
import { BsBookmarkDashFill } from "react-icons/bs";
import { useToast } from "@/components/ui/use-toast";
import BookmarkEmptyIcon from "../../../../../public/images/newicons/bookmarkempty.svg"; // Import SVG as React component
import ArrowUpRightIcon from "../../../../../public/images/newicons/arrowupright.svg"; // Import the arrowupright SVG

// JobDescription Component
const JobDescription: React.FC<{ description: string }> = ({ description }) => {
  const descriptionText = description || "No description available";

  return (
    <p
      className="text-base text-gray-600 line-clamp-3"
      style={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        WebkitLineClamp: 3, // Clamp to 3 lines
      }}
    >
      {descriptionText}
    </p>
  );
};

 
const ImageWithFallback: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div className="w-16 h-16 mr-4 rounded-full bg-gray-300 flex items-center justify-center">
        {/* Optionally, you can add initials or a placeholder icon here */}
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
      <Image
        src={src}
        width={64}  // Ensures the width is 64px
        height={64} // Ensures the height is 64px
        className="object-cover w-full h-full"
        alt={alt}
        onError={() => setImgError(true)}
      />
    </div>
  );
};

const MatchedJobs: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  
  // Local state to track the jobs that have been saved
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  const jobSeekerId = 
    typeof window !== "undefined" ? localStorage.getItem("_id") || "" : "";

  useEffect(() => {
    if (jobSeekerId) {
      dispatch(fetchBestMatchedJobs(jobSeekerId));
    }

    const accessToken = localStorage.getItem("accessToken");
    if (jobSeekerId && accessToken) {
      dispatch(getSavedJobs({ jobSeekerId, accessToken }));
    }
  }, [dispatch, jobSeekerId]);

  const matchedJobs = useSelector(
    (state: RootState) => state.job.bestMatchedJobs
  );
  const loading = useSelector(
    (state: RootState) => state.job.status === "loading"
  );
  const { jobSeeker } = useSelector((state: RootState) => state.jobSeeker);

  useEffect(() => {
    if (jobSeeker?.savedJobs) {
      setSavedJobs(jobSeeker.savedJobs.map((job) => job._id));
    }
  }, [jobSeeker]);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedJobs = showAll ? matchedJobs : matchedJobs.slice(0, 8);

  const handleMoreDetailsClick = (jobId: string) => {
    router.push(`/job-description/${jobId}`);
  };

  const handleBookmarkClick = async (jobId: string) => {
    const accessToken = localStorage.getItem("accessToken");

    if (jobSeekerId && accessToken) {
      try {
        await dispatch(fetchJobById(jobId)).unwrap();
        await dispatch(toggleSaveJob({ jobId, jobSeekerId, accessToken })).unwrap();

        // Update local savedJobs state
        setSavedJobs((prev) => {
          if (prev.includes(jobId)) {
            return prev.filter((id) => id !== jobId);
          } else {
            return [...prev, jobId];
          }
        });

        toast({
          title: "Job Saved",
          description: "Job saved successfully!",
        });
      } catch (error) {
        console.error("Failed to save job:", error);
        toast({
          title: "Failed to Save Job",
          description: "There was an error saving the job.",
          variant: "destructive",
        });
      }
    } else {
      console.error("Missing jobSeekerId or accessToken");
      toast({
        title: "Missing Information",
        description: "Missing jobSeekerId or accessToken",
        variant: "destructive",
      });
    }
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.includes(jobId);
  };

  return (
    <div className="  container md:py-24 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="md:text-4xl text-2xl text-blackish">Matched Jobs</h1>
        {matchedJobs.length > 0 && (
          <button
            onClick={toggleShowAll}
            className="border text-signature text-lg px-4 py-2 rounded-md flex items-center"
          >
            {showAll ? "Show Less" : "View All"} <FaArrowRight className="ml-2" />
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : matchedJobs.length === 0 ? (
        <p className="text-center text-gray-500">No matched jobs found at this time.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 py-12 gap-6">
          {displayedJobs.map((job: Job, index: number) => {
            return (
              <div
                key={index}
                className="p-8 bg-background w-full shadow-sm rounded-lg border flex flex-col justify-between"
                style={{ minHeight: "350px" }}
              >
                <div>
                  <div className="flex items-center mb-6">
                    {job.company?.companyLogo ? (
                      <div className="w-16 h-16 flex items-center justify-center">
                        <ImageWithFallback
                          src={job.company.companyLogo}
                          alt={job.company.companyName || "/images/placeholderimage.png"} />
                      </div>
                    ) : (
                      <div className="w-16 h-16 mr-4 rounded-full bg-gray-300 flex items-center justify-center">
                      </div>
                    )}
                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-300 mx-4"></div>
                    <div className="text-sm text-signature bg-muted p-2 rounded-full">
                      {job.jobType}
                    </div>
                    <div
                      className="ml-auto cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmarkClick(job._id);
                      } }
                    >
                      {isJobSaved(job._id) ? (
                        <BsBookmarkDashFill className="text-signature" size={20} />
                      ) : (
                        <BookmarkEmptyIcon className="text-signature"  />
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                  </div>
                  <div className="mb-1">
                    <JobDescription description={job.description} />
                  </div>
                </div>
                <div className="">
                  <Button
                    variant={"link"}
                    className="text-signature px-0 text-sm py-2 rounded-md"
                    onClick={() => handleMoreDetailsClick(job._id)}
                  >
                    More Details <ArrowUpRightIcon className="ml-2"  />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatchedJobs;
