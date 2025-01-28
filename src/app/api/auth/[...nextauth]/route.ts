// // app/api/auth/[...nextauth]/route.ts

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { NextRequest, NextResponse } from "next/server";

// const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId:
//         process.env.GOOGLE_CLIENT_ID ||
//         "68932067510-v9g6unvdab5nj8s34bhiq45m840l83oj.apps.googleusercontent.com",
//       clientSecret:
//         process.env.GOOGLE_CLIENT_SECRET ||
//         "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",
//     }),
//   ],
//   // pages: {
//   //   newUser: "/send-otp",
//   //   signOut: "/auth/signout",
//   //   error: "/auth/error",
//   //   verifyRequest: "/auth/verify-request",
//   // },
// };

// const handler = NextAuth(authOptions);

// export async function GET(req: NextRequest) {
//   return handler(req, new NextResponse());
// }

// export async function POST(req: NextRequest) {
//   return handler(req, new NextResponse());
// }

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    GoogleProvider({
      clientId:
        process.env.GOOGLE_CLIENT_ID ||
        "68932067510-v9g6unvdab5nj8s34bhiq45m840l83oj.apps.googleusercontent.com",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ||
        "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",
    }),
  ],
});

export { handler as GET, handler as POST };
