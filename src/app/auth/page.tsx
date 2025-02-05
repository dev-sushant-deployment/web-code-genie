"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { login as actionLogin, signup as actionSignup } from "@/actions/user";
import { Loader } from "lucide-react";
import { ACCESS_TOKEN_KEY } from "@/constants";
import eventEmitter from "@/helper/eventEmitter";
import { useCode } from "@/context/code";
import { createCode } from "@/actions/code";

const AuthPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { prompt: initialPrompt, response } = useCode();
  const login= searchParams.get('login');
  const signup = searchParams.get('signup');
  const prompt = searchParams.get('prompt');
  if ((login == "true" && signup == "true") || (login == "false" && signup == "false")) notFound();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const validate = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
      toast.error("Email is invalid");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  }
  const handleSuccess = async (toastId : string | number) => {
    if (prompt) {
      toast.loading("Saving code...", { id: toastId });
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!accessToken) throw new Error("Access token not found");
      const { data, error } = await createCode(accessToken, response, initialPrompt);
      if (error) throw new Error(error);
      if (!data) throw new Error("An Unexpected error occurred");
      const codeId = data.id;
      toast.success("Code saved successfully", { id: toastId });
      setLoading(false);
      router.back();
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push(`/workspace/${codeId}?prompt=${prompt}&token=${accessToken}`);
    } else {
      setLoading(false);
      router.push("/");
    }
  }
  const handleLogin = async () => {
    if (validate()) {
      setLoading(true);
      const toastId = toast.loading("Logging in...");
      try {
        const { error, name : loggedInUserName, accessToken } = await actionLogin(email, password);
        if (error) throw new Error(error);
        if (!accessToken && !loggedInUserName) throw new Error("An Unexpected error occurred");
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        eventEmitter.emit("user:login", { userName: loggedInUserName, userEmail: email });
        toast.success("Logged in successfully", { id: toastId });
        handleSuccess(toastId);
      } catch (error) {
        const message = error instanceof Error ? error.message : "An Unexpected error occurred";
        toast.error(message, { id: toastId });
        setLoading(false);
      }
    }
  }
  const handleSignup = async () => {
    if (!name) {
      toast.error("Name is required");
      return;
    }
    if (validate()) {
      setLoading(true);
      const toastId = toast.loading("Signing up...");
      try {
        const { error } = await actionSignup(name, email, password);
        if (error) throw new Error(error);
        eventEmitter.emit("user:login", { userName: name, userEmail: email });
        toast.success("Signed up successfully", { id: toastId });
        handleSuccess(toastId);
      } catch (error) {
        const message = error instanceof Error ? error.message : "An Unexpected error occurred";
        toast.error(message, { id: toastId });
        setLoading(false);
      }
    }
  }
  return (
    <Tabs
      value={login == "true" ? "login" : "signup"}
      className="flex flex-col p-5 rounded-xl border-[1px] border-gray-800 w-[350px] bg-background"
    >
      <TabsList className="flex gap-4 mb-4">
        <TabsTrigger
          value="login"
          onClick={() => router.replace(`/auth?login=true&signup=false${prompt ? `&prompt=${prompt}` : ""}`)}
          className="w-1/2"
        >Login</TabsTrigger>
        <TabsTrigger
          value="signup"
          onClick={() => router.replace(`/auth?login=false&signup=true${prompt ? `&prompt=${prompt}` : ""}`)}
          className="w-1/2"
        >Signup</TabsTrigger>
      </TabsList>
      <TabsContent
        value="login"
        className="flex flex-col items-center justify-center gap-4 w-full"
      >
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl h-10"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl h-10"
          />
        </div>
        <Button
          className="w-full rounded-xl flex items-center justify-center gap-2"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading && <Loader className="w-5 h-5 mr-2 animate-spin" />}
          <span>{loading ? "Login in..." : "Login"}</span>
        </Button>
      </TabsContent>
      <TabsContent
        value="signup"
        className="flex flex-col items-center justify-center gap-4 w-full"
      >
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="signup-name">Name</Label>
          <Input
            id="signup-name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl h-10"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl h-10"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="signup-password">Password</Label>
          <Input
            id="signup-password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl h-10"
          />
        </div>
        <Button
          className="w-full rounded-xl flex items-center justify-center gap-2"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading && <Loader className="w-5 h-5 mr-2 animate-spin" />}
          <span>{loading ? "Signing up..." : "Signup"}</span>
        </Button>
      </TabsContent>
    </Tabs>
  )
}

export default AuthPage;