"use client";
import { handleLogin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const LoginForm = () => {

  return (
    <div className="grid place-items-center w-screen h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={handleLogin}
            className="flex flex-col gap-4"
          >
            <Input type="email" placeholder="Enter email" name="email" />
            <Input
              type="password"
              placeholder="Enter password"
              name="password"
            />
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
