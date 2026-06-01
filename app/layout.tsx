import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "BMW M4 Competition | The Ultimate Driving Machine",
  description: "Experience the aggressive sport performance of the BMW M4 Competition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="m-0 p-0 overflow-x-clip" suppressHydrationWarning>
      <body className="antialiased bg-[#020305] m-0 p-0 text-white selection:bg-[#0066b1]/30" suppressHydrationWarning>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
