"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavigationItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ProgramCard {
  image: string;
  category: string;
  title: string;
}

interface PulseFitHeroProps {
  logo?: string;
  navigation?: NavigationItem[];
  ctaButton?: {
    label: string;
    onClick: () => void;
  };
  title: string;
  subtitle: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  disclaimer?: string;
  socialProof?: {
    avatars: string[];
    text: string;
  };
  programs?: ProgramCard[];
  backgroundImage?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PulseFitHero({
  logo = "Arunika Tailor",
  navigation = [
    { label: "Beranda", href: "#beranda" },
    { label: "Layanan", href: "#layanan" },
    { label: "Galeri", href: "#galeri" },
    { label: "Tentang", href: "#tentang" },
    { label: "Cek Status", href: "#cek-status" },
    { label: "Kontak", href: "#kontak" },
  ],
  ctaButton,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  disclaimer,
  socialProof,
  programs = [],
  backgroundImage = "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80",
  className,
  children,
}: PulseFitHeroProps) {
  // Multiply items 4 times to guarantee 100% seamless pixel-perfect infinite loop (-50% loop shift)
  const carouselItems = [...programs, ...programs, ...programs, ...programs];

  return (
    <section
      className={cn(
        "relative w-full min-h-screen flex flex-col overflow-hidden bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950",
        className
      )}
      role="banner"
      aria-label="Hero section"
    >
      {/* Real Photography Background with Dark Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 transform scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/85 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />

      {/* Centered Navigation Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex justify-center items-center px-6 lg:px-16 py-6 border-b border-slate-800/40 backdrop-blur-md bg-slate-950/40"
      >
        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-10" aria-label="Main navigation">
          {navigation.map((item, index) => (
            <a
              key={index}
              href={item.href || "#"}
              onClick={item.onClick}
              className="relative text-sm font-semibold tracking-wider uppercase text-slate-300 transition-all duration-300 hover:text-amber-400 group py-1"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
      </motion.header>

      {/* Main Content (Centered Store Profile) */}
      {children ? (
        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center text-center max-w-4xl"
            style={{ gap: "28px" }}
          >
            {/* Store Name Badge / Eyebrow */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md shadow-lg shadow-amber-500/5"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Penjahit Custom Premium Pontianak
              </span>
            </motion.div>

            {/* Main Store Name & Title */}
            <motion.div className="flex flex-col items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.35em] text-amber-400/90">
                {logo}
              </span>
              <h1
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(34px, 5.5vw, 64px)",
                  lineHeight: "1.15",
                  color: "#FFFFFF",
                  letterSpacing: "-0.02em",
                }}
                className="drop-shadow-md"
              >
                {title}
              </h1>
            </motion.div>

            {/* Subtitle / Store Description */}
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(15px, 1.8vw, 19px)",
                lineHeight: "1.65",
                color: "#cbd5e1",
                maxWidth: "700px",
              }}
            >
              {subtitle}
            </p>

            {/* Primary Action Button (WhatsApp) */}
            {primaryAction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-center"
              >
                <button
                  onClick={primaryAction.onClick}
                  className="flex flex-row items-center gap-2.5 px-9 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/20 group"
                  style={{
                    background: "linear-gradient(135deg, #b98a2f 0%, #96701f 100%)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                  }}
                >
                  <span>{primaryAction.label}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path
                      d="M7 10H13M13 10L10 7M13 10L10 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </motion.div>
            )}

            {/* Disclaimer */}
            {disclaimer && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#94a3b8",
                }}
              >
                {disclaimer}
              </motion.p>
            )}

            {/* Social Proof & Trust Badges */}
            {socialProof && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-6 py-3.5 backdrop-blur-md shadow-xl"
              >
                <div className="flex flex-row -space-x-2">
                  {socialProof.avatars.map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt={`Pelanggan ${index + 1}`}
                      className="rounded-full border-2 border-slate-900"
                      style={{
                        width: "38px",
                        height: "38px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#e2e8f0",
                  }}
                >
                  {socialProof.text}
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* Interactive Continuous Infinite Carousel (Continuous Auto-scroll + Drag/Swipe) */}
      {programs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="relative z-10 w-full overflow-hidden py-6 select-none"
        >
          {/* Gradient Overlays for Edge Fading */}
          <div
            className="absolute left-0 top-0 bottom-0 z-20 pointer-events-none"
            style={{
              width: "140px",
              background: "linear-gradient(90deg, #020617 0%, rgba(2, 6, 23, 0) 100%)",
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 z-20 pointer-events-none"
            style={{
              width: "140px",
              background: "linear-gradient(270deg, #020617 0%, rgba(2, 6, 23, 0) 100%)",
            }}
          />

          {/* Draggable Outer Container (Allows Manual Swipe/Drag Without Stopping Auto-scroll) */}
          <motion.div
            className="flex w-full overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: -2400, right: 0 }}
            dragElastic={0.05}
          >
            {/* Auto-scrolling Continuous Marquee Track */}
            <motion.div
              className="flex items-center gap-6 pl-6 shrink-0"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 35,
                  ease: "linear",
                },
              }}
            >
              {carouselItems.map((program, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 relative overflow-hidden group border border-slate-800/80 rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.03]"
                  style={{
                    width: "310px",
                    height: "390px",
                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <img
                    src={program.image}
                    alt={program.title}
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                  />

                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 25%, rgba(2, 6, 23, 0.95) 100%)",
                    }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1.5 pointer-events-none">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                      {program.category}
                    </span>
                    <h3 className="text-lg font-semibold text-white leading-snug">
                      {program.title}
                    </h3>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
