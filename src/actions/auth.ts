"use server";
import axios from "axios";
 
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL   || 'https://ajs-server.hostdonor.com/api/v1';
interface StoreTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export async function storeToken(request: StoreTokenRequest) {
  cookies().set({
    name: "accessToken",
    value: request.accessToken,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  cookies().set({
    name: "refreshToken",
    value: request.refreshToken,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
}

export const handleLogin = async (formData: FormData) => {
  const email = formData.get("email") as string | undefined;
  const password = formData.get("password") as string | undefined;
  let redirectPath: string | null = null;

  

  if (!email || !password) {
    
    return;
  }

  const api = `${baseUrl}/api/v1/auth/login/admin`;

  try {
    const response = await axios.post(api, {
      email,
      password,
    });

    if (response.status === 200) {
      

      await storeToken({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      redirectPath = "/";
    }
  } catch (error: any) {
   
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
};
