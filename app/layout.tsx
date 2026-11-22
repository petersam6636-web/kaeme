import type { Metadata } from "next";
import { Sansita } from "next/font/google";
import ContextFile from "@/lib/ContextFile";

import "./globals.css";

const sanita = Sansita({
  variable: "--font-sanita",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "votesphere",
  description: "Your votesphere application",
};



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sanita.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ContextFile>{children}</ContextFile>
      </body>
    </html>
  );
}

