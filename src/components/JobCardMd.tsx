import Tag from "@/components/Tag";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BsBookmarkDash, BsBookmarkDashFill } from "react-icons/bs";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

const JobCardMd = ({
  job,
  handleBookmarkClick,
  isJobSaved,
  handleApplyClick,
  handleDeclineClick,
}: any) => {
  const companyLogo = job.company?.companyLogo;
  return (
    <div className="flex justify-between items-start">
      {/* col 1 */}
      <div className="flex">
        {companyLogo ? (
          <div
            style={{
              width: "61px",
              height: "61px",
              position: "relative",
              borderRadius: "50%",
              overflow: "hidden",
              marginRight: "16px",
            }}
          >
            <Image
              src={companyLogo}
              alt={job.company?.companyName || "Company Logo"}
              layout="fill"
              objectFit="cover"
            />
          </div>
        ) : (
          <div
            style={{
              width: "61px",
              height: "61px",
              backgroundColor: "#ccc",
              borderRadius: "50%",
              display: "inline-block",
              marginRight: "16px",
            }}
          />
        )}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="md:text-xl text-lg font-bold">{job.title}</h3>
            <div className="flex gap-2 items-center">
              <p className="text-sm text-gray-500">
                <span className="font-semibold">
                  {job.company?.companyName}
                </span>{" "}
                • {job.company?.city}, {job.company?.province},{" "}
                {job.company?.country}
              </p>
              <IoCheckmarkDoneSharp className="md:block text-signature" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tag value={job.jobType} filled />
            <div className=" h-5 border border-lightgrey"></div>
            <div className="md:flex gap-2">
              {job.skills?.map((skill: string, i: number) => {
                return <Tag key={i} value={skill} />;
              })}
            </div>
            <div
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                handleBookmarkClick(job._id);
              }}
            >
              {isJobSaved(job._id) ? (
                <BsBookmarkDashFill className="text-signature" size={20} />
              ) : (
                <BsBookmarkDash className="text-signature" size={20} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* col 2 */}
      <div className="flex flex-col gap-4">
        <p className="md:text-xl text-md font-semibold">
          ${job.salary.from}/Monthly
        </p>

        <div className="flex flex-col gap-2">
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleApplyClick(job._id);
            }}
            className={`text-background bg-signature`}
          >
            Apply Now
          </Button>
          <Button
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              handleDeclineClick(job._id);
            }}
            className="text-red-500"
          >
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCardMd;
