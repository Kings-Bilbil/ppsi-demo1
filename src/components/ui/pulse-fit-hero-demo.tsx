"use client";

import { PulseFitHero } from "@/components/ui/pulse-fit-hero";

const WA_LINK = "https://wa.me/6281234567890";

export default function PulseFitHeroDemo() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PulseFitHero
      logo="Arunika Tailor"
      navigation={[
        { label: "Beranda", onClick: () => scrollTo("#beranda") },
        { label: "Layanan", onClick: () => scrollTo("#layanan") },
        { label: "Galeri Karya", onClick: () => scrollTo("#galeri") },
        { label: "Tentang Kami", onClick: () => scrollTo("#tentang") },

        { label: "Kontak", onClick: () => scrollTo("#kontak") },
      ]}
      title="Penjahitan Presisi untuk Gaya Khas Anda"
      subtitle="Dari kebaya pernikahan, jas pengantin, hingga seragam kantor — setiap potong dikerjakan dengan cermat, bahan pilihan, dan transparansi status pesanan real-time."
      primaryAction={{
        label: "Pesan via WhatsApp",
        onClick: () => window.open(WA_LINK, "_blank"),
      }}
      disclaimer="*Pengukuran gratis dan garansi perbaikan ulang jika ukuran tidak pas"
      socialProof={{
        avatars: [
          "https://i.pravatar.cc/150?img=32",
          "https://i.pravatar.cc/150?img=12",
          "https://i.pravatar.cc/150?img=47",
          "https://i.pravatar.cc/150?img=68",
        ],
        text: "Dipercaya oleh lebih dari 3.200 pelanggan di Pontianak",
      }}
      backgroundImage="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80"
      programs={[
        {
          image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=650&fit=crop",
          category: "BUSANA CUSTOM",
          title: "Kebaya Modern & Akad Nikah",
        },
        {
          image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop",
          category: "FORMAL WEAR",
          title: "Jas Pengantin & Tuxedo Premium",
        },
        {
          image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=650&fit=crop",
          category: "EVENING WEAR",
          title: "Gaun Pesta & Evening Dress",
        },
        {
          image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=650&fit=crop",
          category: "SERAGAM",
          title: "Kemeja Formal & Seragam Kantor",
        },
        {
          image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=500&h=650&fit=crop",
          category: "PREMIUM WEAR",
          title: "Gamis & Busana Muslim Premium",
        },
      ]}
    />
  );
}
