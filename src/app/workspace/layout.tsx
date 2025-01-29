import { CodeProvider } from "@/context/code";

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth?: React.ReactNode;
}>) {
  return (
    <CodeProvider>
      {children}
      {auth}
    </CodeProvider>
  );
}
