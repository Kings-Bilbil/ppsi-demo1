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
        { label: "Galeri", onClick: () => scrollTo("#galeri") },
        { label: "Tentang", onClick: () => scrollTo("#tentang") },
        { label: "Cek Status", onClick: () => scrollTo("#cek-status") },
      ]}
      ctaButton={{
        label: "Lacak Pesanan Saya",
        onClick: () => scrollTo("#cek-status"),
      }}
      title="Penjahitan Presisi untuk Gaya Khas Anda"
      subtitle="Dari kebaya pernikahan, jas pengantin, hingga seragam kantor — setiap potong dikerjakan dengan cermat, bahan pilihan, dan transparansi status pesanan real-time."
      primaryAction={{
        label: "Pesan via WhatsApp",
        onClick: () => window.open(WA_LINK, "_blank"),
      }}
      secondaryAction={{
        label: "Lihat Galeri Karya",
        onClick: () => scrollTo("#galeri"),
      }}
      disclaimer="*Pengukuran gratis & garansi perbaikan ulang jika ukuran tidak pas"
      socialProof={{
        avatars: [
          "https://i.pravatar.cc/150?img=32",
          "https://i.pravatar.cc/150?img=12",
          "https://i.pravatar.cc/150?img=47",
          "https://i.pravatar.cc/150?img=68",
        ],
        text: "Dipercaya lebih dari 3.200+ pelanggan di Pontianak",
      }}
      showStatusCheck={true}
      programs={[
        {
          image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=650&fit=crop",
          category: "CUSTOM WEAR",
          title: "Kebaya Modern & Akad Nikah",
          onClick: () => scrollTo("#galeri"),
        },
        {
          image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop",
          category: "FORMAL WEAR",
          title: "Jas Pengantin & Tuxedo Premium",
          onClick: () => scrollTo("#galeri"),
        },
        {
          image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&h=650&fit=crop",
          category: "ELEGANT DRESS",
          title: "Gaun Pesta & Evening Wear",
          onClick: () => scrollTo("#galeri"),
        },
        {
          image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=650&fit=crop",
          category: "KORPORAT",
          title: "Kemeja Formal & Seragam Kantor",
          onClick: () => scrollTo("#galeri"),
        },
        {
          image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=500&h=650&fit=crop",
          category: "PREMIUM WEAR",
          title: "Gamis & Busana Muslim Premium",
          onClick: () => scrollTo("#galeri"),
        },
      ]}
    />
  );
}
