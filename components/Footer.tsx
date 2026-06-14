"use client";

import { ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { sfx } from "@/lib/audio";

const footerLinks = [
  {
    title: "Models",
    links: [
      { label: "M2 Competition", href: "#" },
      { label: "M3 Touring", href: "#" },
      { label: "M4 CS", href: "#" },
      { label: "M5 CS", href: "#" },
      { label: "XM Label Red", href: "#" },
    ],
  },
  {
    title: "Experience",
    links: [
      { label: "Driving Dynamics", href: "#performance" },
      { label: "M Setup", href: "#story" },
      { label: "Track Mode", href: "#" },
      { label: "Heritage", href: "/heritage" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Build Your Own", href: "#m-cars" },
      { label: "Find a Dealer", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Newsletter", href: "#" },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/10 bg-[#020305] font-satoshi text-[#e8edf2]">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col px-5 py-14 md:px-10 md:py-24">
        <div className="flex flex-col gap-14 lg:flex-row lg:justify-between">
          <div className="flex flex-col items-start gap-6 lg:max-w-xs">
            <Image
              src="/bmw-logo-v2.png"
              alt="BMW"
              width={64}
              height={64}
              unoptimized
              className="h-14 w-14 object-contain"
            />
            <div>
              <h3 className="text-base font-medium tracking-wide text-white">BMW M GmbH</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/50">
                The most powerful letter in the world. Engineered for high performance and pure driving pleasure.
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/70 transition-colors hover:text-white"
            >
              Back to top
              <ChevronUp size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:gap-24">
            {footerLinks.map((column) => (
              <div key={column.title} className="flex flex-col gap-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">
                  {column.title}
                </h4>
                <div className="flex flex-col gap-4">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onMouseEnter={() => sfx.playHover()}
                      onClick={() => sfx.playClick()}
                      className="text-sm font-medium text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-18 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 text-[11px] font-medium tracking-wider text-white/40 md:mt-24 md:flex-row md:items-center">
          <p>&copy; 2026 BMW AG. Concept Showcase. Not affiliated with BMW AG.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 md:gap-x-8">
            <Link href="#" onMouseEnter={() => sfx.playHover()} onClick={() => sfx.playClick()} className="transition-colors hover:text-white">
              Imprint
            </Link>
            <Link href="#" onMouseEnter={() => sfx.playHover()} onClick={() => sfx.playClick()} className="transition-colors hover:text-white">
              Legal Disclaimer
            </Link>
            <Link href="#" onMouseEnter={() => sfx.playHover()} onClick={() => sfx.playClick()} className="transition-colors hover:text-white">
              Data Privacy
            </Link>
            <Link href="#" onMouseEnter={() => sfx.playHover()} onClick={() => sfx.playClick()} className="transition-colors hover:text-white">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
