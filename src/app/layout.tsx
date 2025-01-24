import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
