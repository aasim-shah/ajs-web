import Link from "next/link";

const OAuth = () => {
  return (
    <div className="flex flex-col gap-4 h-screen justify-center items-center">
      <Link
        className="p-2 bg-signature-200 rounded text-background hover:bg-signature-300 font-bold w-full"
        href="/test/auth/google?role=jobSeeker"
      >
        Login with Google as Job Seeker
      </Link>
      <p>OR</p>
      <Link
        className="p-2 bg-signature-200 rounded text-background hover:bg-signature-300 font-bold w-full"
        href="/test/auth/google?role=company"
      >
        Login with Google as Company
      </Link>
    </div>
  );
};

export default OAuth;
