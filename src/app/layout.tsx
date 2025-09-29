import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Connect",
  description: "HR Application with Next.js + Prisma + JWT + Line Bot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >   
      <body>{children}</body>
    </html>
  );
}
