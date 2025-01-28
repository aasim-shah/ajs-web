import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/store";
import { fetchJobApplicationDetail } from "@/store/slices/appliedApplicantSlice/appliedApplicantSlice";

const Resume = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    applicationDetail: jobApplication,
    status,
    error,
  } = useSelector((state: RootState) => state.appliedApplicant);
  const params = useParams();
  const applicationId = params.id as string;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  useEffect(() => {
    if (applicationId && token) {
      dispatch(fetchJobApplicationDetail({ applicationId, token }));
    }
  }, [dispatch, applicationId, token]);

  let content;

  if (status === "loading") {
    content = <div>Loading...</div>;
  } else if (status === "failed") {
    content = <div>Error: {error}</div>;
  } else if (!jobApplication) {
    content = <div>No Application Found</div>;
  } else {
    const resumeUrl = jobApplication.jobSeeker?.resume?.replace(/ /g, "%20"); // Replace spaces with %20
    content = (
      <div>
        <h1>My Resume</h1>
        {resumeUrl ? (
          <iframe
            src={resumeUrl}
            width="100%"
            height="600px"
            title="Resume"
            frameBorder="0"
            onLoad={() => console.log("Resume loaded successfully")}
            onError={() => console.error("Error loading resume")}
          >
            Your browser does not support iframes.
          </iframe>
        ) : (
          <p>No resume available.</p>
        )}
      </div>
    );
  }

  return <div>{content}</div>;
};

export default Resume;
