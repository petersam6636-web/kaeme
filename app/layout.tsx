import type { Metadata } from "next";
import { Bodoni_Moda, Geist_Mono } from "next/font/google";
import ContextFile from "@/lib/ContextFile";
import GoogleSignInPrompt from "@/component/GoogleSignInPrompt";

import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kaeme",
  description: "Schedule your time to remind you",
};



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col ">
        <ContextFile>
          {children}
          <GoogleSignInPrompt />
        </ContextFile>
      </body>
    </html>
  );
}

