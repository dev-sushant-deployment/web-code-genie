"use client";

import AuthPage from "@/app/auth/page";
import { Auth } from "./auth";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";

const AuthIntercept = () => {
  const router = useRouter();
  function onDismiss() {
    router.back();
  }
  return (
    <Auth>
      <Toaster
        richColors={true}
        theme="dark"
        position="top-center"
      />
      <div className="h-fit w-fit rounded-[12px] relative flex justify-center items-center p-4 bg-popover-background">
      <Button variant="destructive" onClick={onDismiss} className="absolute top-2 right-2 p-0 h-8 w-8 cursor-pointer flex justify-center items-center">
        <X size={24} />
      </Button>
      <AuthPage />
      </div>
    </Auth>
  )
};

export default AuthIntercept;