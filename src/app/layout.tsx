

import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { Navbar } from "@/components/general/Navbar";
import { Footer } from "@/components/general/Footer";
import { Toaster } from "@/components/client/Toaster";

export const metadata: Metadata = {
  title: "Web Code Genie",
  description: "Generate code snippets for web development",
};

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth?: React.ReactNode;
}>) {
  return (<Suspense fallback={<div>Loading...</div>}>
      <html lang="en" className="scroll-smooth dark">
        <body>
          <Toaster />
          <div className="min-h-lvh flex flex-col items-center justify-between">
            <Navbar />
            {children}
            <Footer/>
          </div>
          {auth}
        </body>
      </html>
    </Suspense>)
}
