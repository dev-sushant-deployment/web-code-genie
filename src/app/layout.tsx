import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/general/Navbar";
import { Footer } from "@/components/general/Footer";
import { Toaster } from "sonner";


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
  return (
    <html lang="en" className="scroll-smooth dark">
      <body>
        <Toaster
          richColors={true}
          theme="light"
          position="top-center"
        />
        <div className="min-h-lvh flex flex-col items-center justify-between">
          <Navbar />
          {children}
          <Footer/>
        </div>
        {auth}
        <div id="modal-root" className="dark"></div> {/* Portal root */}
      </body>
    </html>
  );
}
