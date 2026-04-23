import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chartly — Your AI scribe for the exam room.",
  description:
    "Listens to the patient conversation. Writes the SOAP note. Cuts physicians' documentation time by 75%.",
  openGraph: {
    title: "Chartly — Your AI scribe for the exam room.",
    description:
      "Listens to the patient conversation. Writes the SOAP note. Cuts physicians' documentation time by 75%.",
    images: [
      {
        url: "https://waitlist-api-sigma.vercel.app/api/og?title=Chartly&accent=cyan&category=Health%20tech",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://waitlist-api-sigma.vercel.app/api/og?title=Chartly&accent=cyan&category=Health%20tech",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-neutral-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
