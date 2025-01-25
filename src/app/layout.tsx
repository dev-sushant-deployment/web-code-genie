import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/general/Navbar";
import { Footer } from "@/components/general/Footer";


export const metadata: Metadata = {
  title: "Web Code Genie",
  description: "Generate code snippets for web development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-black text-white">
        <div className="min-h-lvh flex flex-col items-center justify-between">
          <Navbar />
          {children}
          <Footer/>
        </div>
      </body>
    </html>
  );
}
