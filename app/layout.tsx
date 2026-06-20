import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: "#020305",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "BMW M Showcase | The Ultimate Driving Machine",
    template: "%s | BMW M Showcase",
  },
  description: "Explore the aggressive performance, precision engineering, and legendary heritage of BMW M. Experience the M4 Competition through an interactive 3D showroom.",
  keywords: ["BMW M", "M4 Competition", "BMW M4", "Performance Cars", "3D Car Configurator", "BMW Engineering"],
  authors: [{ name: "BMW M Showcase" }],
  creator: "BMW M Showcase",
  publisher: "BMW M Showcase",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BMW M Showcase | The Ultimate Driving Machine",
    description: "Experience the adrenaline of BMW M performance in high-fidelity 3D.",
    url: "/",
    siteName: "BMW M Showcase",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BMW M4 Competition Showcase",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMW M Showcase | The Ultimate Driving Machine",
    description: "Experience the adrenaline of BMW M performance in high-fidelity 3D.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="m-0 p-0 overflow-x-clip" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Frick-Regular.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Frick-Condensed.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased bg-[#020305] m-0 p-0 text-white selection:bg-[#0066b1]/30" suppressHydrationWarning>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
