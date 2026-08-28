"use client";

import dynamic from "next/dynamic";

const HorizonHeroComponent = dynamic(
  () => import("./horizon-hero-section").then((mod) => mod.Component),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-sm font-semibold tracking-widest text-slate-400">LOADING 3D SCENE...</div>
      </div>
    ),
  }
);

export const DemoOne = () => {
  return <HorizonHeroComponent />;
};
