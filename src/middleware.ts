// next js middleware file
import { cookies } from "next/headers";

export default function middleware() {
  const authToken = cookies().get("accessToken")?.value;
 
}
