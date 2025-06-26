"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import githubLogo from "@/public/github.svg";
import googleLogo from "@/public/google.svg";
import { Input } from "./Input";

export default function AuthPage({ type = "login" }) {
  const isLogin = type === "login";
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { data: session, status } = useSession();
  console.log(session, "session", status);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";

  enum AuthType {
    LOGIN = "login",
    SIGNUP = "signup",
  }

  const handleGithubLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn("github", { callbackUrl: "/dashboard", redirect: false });
    } catch (err) {
      console.log(err, "err in signing with github");
      setError("Failed to sign in with GitHub.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/dashboard", redirect: false });
    } catch (err) {
      console.log(err, "err in signing with google");
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsAuth = async (authType: AuthType) => {
    setLoading(true);
    setError(null);
    if (authType === "login") {
      try {
        const signinRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        setLoading(false);

        if (signinRes && signinRes.ok) {
          toast("Login successful");
          router.push("/dashboard");
          return;
        } else {
          toast(signinRes?.error);
        }
      } catch (error) {
        console.log(error, "err in login");
        setError("unable to login");
      }
    }
    if (authType === "signup") {
      try {
        const res = await axios.post(`${BACKEND_URL}/auth/signup`, {
          name,
          email,
          password,
          authProvider: "credentials",
        });
        setLoading(false);
        if (res.data.success) {
          toast("Signup successful");
          router.push("/login");
        }
      } catch (error) {
        console.log(error, "err in signup");
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row dark:bg-black bg-white">
      {/* Left (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 z-10">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/* <Image src={logo} alt="Dryink Logo" width={30} height={30} /> */}
            <span className="text-xl font-bold">Dryink</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold">
            {isLogin ? "Sign in to your account" : "Sign up for an account"}
          </h2>

          {/* Form */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault(); // Prevent default form submission
              handleCredentialsAuth(isLogin ? AuthType.LOGIN : AuthType.SIGNUP);
            }}
          >
            {!isLogin && (
              <Input
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              variant={"outline"}
              className="w-full cursor-pointer hover:bg-neutral-200 hover:text-neutral-800"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          {/* Switch Auth */}
          <p className="text-sm text-center text-muted-foreground">
            {isLogin ? (
              <>
                Dont have an account?{" "}
                <Link href="/signup" className="text-blue-500">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="text-blue-500">
                  Sign in
                </Link>
              </>
            )}
          </p>

          {/* Divider */}
          <div className="relative my-6">
            <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-700" />
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2 bg-white dark:bg-neutral-900">
              <span className="text-sm text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className=" flex gap-2 flex-col-reverse">
            {/* GitHub Auth */}
            
            {/* Google Auth */}
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full flex items-center justify-center cursor-pointer hover:bg-neutral-200 hover:text-neutral-800"
              disabled={loading}
            >
              <Image
                src={googleLogo}
                alt="Google"
                width={20}
                height={20}
                className="mr-2 dark:text-white dark:bg-white rounded-full bg-neutral-800"
              />
              {loading ? "Loading..." : "Google"}
            </Button>
          </div>

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground">
            By clicking on {isLogin ? "sign in" : "sign up"}, you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Right (Info Box with dashed borders) */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-8 border-l bg-neutral-100 border-dashed dark:bg-neutral-900 border-gray-700 dark:border-neutral-900">
        <div className="text-center max-w-md">
          {/* Avatar Group */}
          <div className="flex justify-center mb-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
                <Image
                  key={i}
                  src={`avatar${i}.svg`}
                  alt="user"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
              ))}
            </div>
          </div>

          {/* Message */}
          <h3 className="text-lg font-semibold">
            Dryink is used by thousands of users
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {/* write a short description of Dryink here */}
            Forget creating videos for your students. Dryink is a powerful tool
            that simplifies complex ideas into engaging, animated videos.
          </p>
        </div>
      </div>
    </div>
  );
}
