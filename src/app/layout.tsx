import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DatingApp - Admin Portal",
  description: "Dating App Admin Web Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#0B1120] text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
