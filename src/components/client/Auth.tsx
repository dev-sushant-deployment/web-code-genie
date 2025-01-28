"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN_KEY } from "@/constants";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { middleware } from "@/actions/user";

export const checkAuth = () => {
  if (localStorage.getItem(ACCESS_TOKEN_KEY)) return true;
  return false;
}

export const Auth = () => {
  const [name, setName] = useState("");
  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setName("");
  }
  useEffect(() => {
    const authenticate = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!accessToken) return;
      try {
        const { error, name } = await middleware(accessToken);
        if (error) throw new Error(error);
        if (!name) throw new Error("An Unexpected error occurred");
        setName(name);
      } catch (error) {
        console.log("error in middleware", error);
      }
    }
    authenticate();
  }, [])
  if (!name) return (
    <>
      <li>
        <Link href="/auth?login=true&signup=false">
          <Button variant="ghost">Login</Button>
        </Link>
      </li>
      <li>
        <Link href="/auth?login=false&signup=true">
          <Button variant="ghost">Signup</Button>
        </Link>
      </li>
    </>
  )
  return (
    <>
      <li>
        <Button variant="ghost" onClick={handleLogout}>Logout</Button>
      </li>
      <li>
        <Avatar>
          <AvatarFallback>{name?.split(" ").map(word => word[0].toUpperCase()).join("") || "?"}</AvatarFallback>
        </Avatar>
      </li>
    </>
  )
}