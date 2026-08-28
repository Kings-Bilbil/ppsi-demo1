import {
  ChatIcon,
  CheckIcon,
  ClockIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  RulerIcon,
  ScissorsIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
} from "@/components/icons";
import { NeedleLogo, SpoolArt } from "@/components/GarmentArt";
import CheckStatusForm from "@/components/CheckStatusForm";
import PulseFitHeroDemo from "@/components/ui/pulse-fit-hero-demo";

const WA_LINK = "https://wa.me/6281234567890";

const NAV = [
  { href: "#beranda", label: "Beranda" },
  { href: "#layanan", label: "Layanan" },
  { href: "#galeri", label: "Galeri" },
  { href: "#tentang", label: "Tentang" },
  { href: "#cek-status", label: "Cek Status" },
  { href: "#kontak", label: "Kontak" },
];

const SERVICES = [
  {
    icon: <ScissorsIcon className="h-6 w-6" />,
    title: "Jahitan Custom",
    desc: "Baju dibuat khusus sesuai ukuran tubuh dan selera Anda — kemeja, gaun, kebaya, hingga jas.",
  },
  {
    icon: <RulerIcon className="h-6 w-6" />,
    title: "Ukur & Perbaikan",
    desc: "Mengecilkan, memanjangkan, atau merombak pakaian agar jatuhnya sempurna di badan.",
  },
  {
    icon: <UsersIcon className="h-6 w-6" />,
    title: "Seragam & Orderan",
    desc: "Seragam kantor, komunitas, dan acara dengan hasil konsisten untuk puluhan potong.",
  },
  {
    icon: <SparklesIcon className="h-6 w-6" />,
    title: "Konsultasi Desain",
    desc: "Bingung memilih model dan bahan? Tim kami bantu dari sketsa sampai jadi.",
  },
];

const GALLERY = [
  {
    name: "Kebaya Modern & Akad Nikah",
    category: "Pesta & Adat",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=600&fit=crop",
  },
  {
    name: "Jas Pengantin & Tuxedo",
    category: "Formal & Pesta",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop",
  },
  {
    name: "Gaun Pesta & Evening Wear",
    category: "Evening Wear",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&h=600&fit=crop",
  },
  {
    name: "Kemeja Formal Custom",
    category: "Harian & Kerja",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop",
  },
  {
    name: "Gamis Premium",
    category: "Religi & Santai",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=600&h=600&fit=crop",
  },
  {
    name: "Seragam Kantor & Instansi",
    category: "Korporat",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=600&fit=crop",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Amelia",
    role: "Pengantin 2025",
    quote:
      "Kebaya akad nikah saya jahit di sini dan hasilnya luar biasa. Ukurannya pas sekali di badan dan detail rendanya sangat rapi.",
  },
  {
    name: "Hendra Gunawan",
    role: "Pemilik Restoran",
    quote:
      "Order 40 seragam staf dan semuanya selesai tepat waktu. Kualitas jahitan konsisten dari potongan pertama sampai terakhir.",
  },
  {
    name: "Maria Krisdayanti",
    role: "Pelanggan Sejak 2021",
    quote:
      "Fitur cek status pesanannya bikin tenang — tinggal masukkan kode 6 huruf, langsung kelihatan bajunya sedang dalam proses apa.",
  },
];

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-block rounded-full bg-amber-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-amber-400 border border-amber-500/30 backdrop-blur-md">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-sans text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl tracking-tight drop-shadow">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-slate-300">{subtitle}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main id="beranda" className="bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Centered Store Profile Hero Section */}
      <PulseFitHeroDemo />

      {/* Layanan Kami (With Real Photography Background Overlay) */}
      <section id="layanan" className="relative overflow-hidden py-20 lg:py-28 border-t border-slate-800/60">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-sm" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Layanan Kami"
            title="Semua kebutuhan jahit dalam satu tempat"
            subtitle="Fokus pada detail presisi, bahan berkualitas, dan transparansi pengerjaan dari awal sampai pesanan selesai."
          />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="group relative rounded-2xl border border-slate-800/90 bg-slate-900/80 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-amber-700 group-hover:text-white shadow">
                  {s.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Karya */}
      <section id="galeri" className="relative overflow-hidden py-20 lg:py-28 border-t border-slate-800/60 bg-slate-950">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Galeri Karya"
            title="Hasil pengerjaan busana terbaru"
            subtitle="Sebagian hasil karya terbaik yang dikerjakan dengan presisi tinggi dari meja jahit Arunika Tailor."
          />
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {GALLERY.map((g) => (
              <figure
                key={g.name}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-2xl"
              >
                <img
                  src={g.image}
                  alt={g.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-95" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-left transition-transform duration-300">
                  <span className="inline-block rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-300 border border-amber-500/30 backdrop-blur-md mb-2">
                    {g.category}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {g.name}
                  </h3>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Tentang Kami (With Real Photography Background Overlay) */}
      <section id="tentang" className="relative overflow-hidden py-20 lg:py-28 border-t border-slate-800/60">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-slate-950/93 backdrop-blur-sm" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative mx-auto flex h-88 w-full max-w-md items-center justify-center rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/90 to-indigo-950/70 p-8 shadow-2xl backdrop-blur-md">
            <SpoolArt className="h-44 w-44 text-amber-400/80 drop-shadow-lg" />
            <span className="absolute right-6 top-6 rounded-full border border-amber-500/30 bg-amber-500/20 px-4 py-1.5 text-xs font-bold text-amber-400 shadow backdrop-blur-md">
              Sejak 2014 • Pontianak
            </span>
          </div>

          <div>
            <SectionHeading
              eyebrow="Tentang Kami"
              title="Meja jahit lokal dengan standar kualitas tinggi"
            />
            <div className="mt-6 space-y-4 leading-relaxed text-slate-300">
              <p>
                Arunika Tailor berawal dari satu mesin jahit di rumah di Kota Pontianak.
                Selama lebih dari 12 tahun berjalan, kami telah menyelesaikan lebih dari 3.200 pesanan —
                dari gaun pesta, kebaya adat, hingga seragam instansi dan perusahaan.
              </p>
              <p>
                Kami percaya pakaian yang indah lahir dari pengukuran yang teliti dan komunikasi yang
                jujur. Setiap pesanan ditangani dengan cermat sehingga kualitasnya terjamin dan tepat waktu.
              </p>
            </div>
            
            <ul className="mt-8 space-y-3.5">
              {[
                "Pengukuran gratis untuk pelanggan baru di Pontianak",
                "Garansi perbaikan ulang jika ukuran tidak pas",
                "Pencekan status pesanan online secara real-time",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-200 font-medium">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              *Berlaku untuk kesalahan produksi dari sisi tim penjahit kami.
            </p>
          </div>
        </div>
      </section>

      {/* Cek Status Pesanan Section (Utama) */}
      <section id="cek-status" className="relative overflow-hidden py-20 lg:py-28 border-t border-slate-800/60">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=1920&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/92 via-slate-950/90 to-slate-950 backdrop-blur-sm" />
        
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <SectionHeading
            eyebrow="Fitur Cek Status Pesanan"
            title="Bajumu sudah sampai mana?"
            subtitle="Masukkan kode pembelian 6 huruf yang Anda terima saat memesan untuk melihat status pengerjaan pesanan Anda secara real-time."
          />
          
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md text-left">
            <CheckStatusForm />
          </div>
        </div>
      </section>

      {/* Testimoni Pelanggan */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-t border-slate-800/60 bg-slate-950">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Testimoni Pelanggan"
            title="Apa kata pelanggan kami"
            subtitle="Kepuasan dan kepercayaaan pelanggan adalah prioritas utama Arunika Tailor."
          />
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1"
              >
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-300 italic">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-800/80 pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-sm font-bold text-white shadow">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-amber-400">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Kontak */}
      <footer id="kontak" className="border-t border-slate-800/80 bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <a href="#beranda" className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow">
                  <NeedleLogo className="h-5 w-5" />
                </span>
                <span className="font-sans text-lg font-bold text-white tracking-wide">
                  Arunika <span className="text-amber-400">Tailor</span>
                </span>
              </a>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                Jasa penjahitan premium di Pontianak untuk pakaian custom, kebaya, jas, seragam, dan perbaikan busana Anda.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-amber-400 hover:text-amber-400 hover:scale-105"
                >
                  <ChatIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com/arunika.tailor"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-amber-400 hover:text-amber-400 hover:scale-105"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="tel:+6281234567890"
                  aria-label="Telepon"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-amber-400 hover:text-amber-400 hover:scale-105"
                >
                  <PhoneIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">Alamat & Kontak</h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3 text-slate-300">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  Jl. Gajah Mada No. 88, Pontianak Tenggara, Kota Pontianak, Kalimantan Barat 78121
                </li>
                <li className="flex gap-3 text-slate-300">
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  +62 812-3456-7890
                </li>
                <li className="flex gap-3 text-slate-300">
                  <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                  Senin – Sabtu, 09.00 – 17.00 WIB
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400">Navigasi Utama</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="text-slate-400 transition hover:text-amber-400">
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="pt-2">
                  <a href="/login" className="text-slate-500 transition hover:text-slate-300 text-xs">
                    Login Portal Admin
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Arunika Tailor Pontianak. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </main>
  );
}
