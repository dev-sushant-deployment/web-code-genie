"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN_KEY } from "@/constants";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { middleware } from "@/actions/user";
import eventEmitter from "@/helper/eventEmitter";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
// import { demoCode } from "@/demoData";
import { Code } from "@/types/types";
import { ArrowRight, Clock } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { getCodesMeta } from "@/actions/code";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

export const checkAuth = () => {
  if (localStorage.getItem(ACCESS_TOKEN_KEY)) return true;
  return false;
}

export const Auth = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [codes, setCodes] = useState<Code[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setName("");
  }
  useEffect(() => {
    const authenticate = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (!accessToken) return;
      try {
        const { error, name, email } = await middleware(accessToken);
        if (error) throw new Error(error);
        if (!name || !email) throw new Error("An Unexpected error occurred");
        setName(name);
        setEmail(email);
      } catch (error) {
        console.log("error in middleware", error);
      }
    }
    authenticate();
    const handleLogin = ({ userName, userEmail } : { userName : string, userEmail : string }) => {
      setName(userName)
      setEmail(userEmail)
    }
    eventEmitter.on("user:login", handleLogin);
    return () => {
      eventEmitter.off("user:login", handleLogin);
    }
  }, [])
  useEffect(() => {
    if (open) {
      const getCodes = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (!accessToken) return;
        try {
          const { error, codes } = await getCodesMeta(accessToken);
          if (error) {
            toast.error(error);
            setLoading(false);
            return;
          }
          if (!codes) {
            toast.error("An Unexpected error occurred");
            setLoading(false);
            return;
          }
          setCodes(codes);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log("error in getCodes", error);
          if (error instanceof Error) toast.error(error.message);
          else toast.error("An Unexpected error occurred");
        }
      }
      getCodes();
    }
  }, [open])
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
        <Sheet
          open={open}
          onOpenChange={setOpen}
        >
          <SheetTrigger asChild className="cursor-pointer">
            <Avatar>
              <AvatarFallback>{name?.split(" ").map(word => word[0].toUpperCase()).join("") || "?"}</AvatarFallback>
            </Avatar>
          </SheetTrigger>
          <SheetContent className="flex flex-col">
            <SheetHeader className="flex flex-row items-center justify-between mt-2 mb-4">
              <div className="flex flex-col items-start justify-between">
                <SheetTitle className="text-lg font-semibold">Generation History</SheetTitle>
                <SheetDescription className="text-sm text-gray-500">{email}</SheetDescription>
              </div>
              <Avatar>
                <AvatarFallback>{name?.split(" ").map(word => word[0].toUpperCase()).join("") || "?"}</AvatarFallback>
              </Avatar>
            </SheetHeader>
            <ScrollArea className="flex-grow">
              <div className="flex flex-col gap-4 pr-3">
                {loading && 
                  [...Array(5)].map((_, index) => 
                    <Skeleton
                    key={index}
                    className="border rounded-lg p-2 hover:bg-accent h-20"
                  />
                  )
                }
                {!loading && codes.length === 0 && (
                  <div className="text-center text-gray-500 text-3xl">No Code Generated Yet</div>
                )}
                {!loading && codes.map(code => (
                  <div key={code.id} className="flex items-center justify-between border rounded-lg p-2 bg-card hover:bg-accent">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-semibold">{code.title}</h3>
                      <div className="text-sm text-gray-500 flex items-center justify-start gap-2">
                        <Clock size={16} />
                        <span>{code.updatedAt.toDateString()}</span>
                      </div>
                    </div>
                    <Link
                      href={`/workspace/${code.id}?token=${localStorage.getItem(ACCESS_TOKEN_KEY)}`}
                      onClick={() => setOpen(false)}
                    >
                      <Button variant="ghost">
                        <ArrowRight size={24} />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </li>
    </>
  )
}