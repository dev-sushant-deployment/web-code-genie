"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster as Toast } from "sonner";

export const Toaster = () => {
  const [hide, setHide] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("intercepted") == "true") setHide(true);
    else setHide(false);
  }, [searchParams.get("intercepted")]);

  if (hide) return null;
  return (
    <Toast
      richColors={true}
      theme="dark"
      position="top-center"
    />
  )
}