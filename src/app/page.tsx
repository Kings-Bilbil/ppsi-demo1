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
import { DressArt, GamisArt, JacketArt, KebayaArt, NeedleLogo, ShirtArt, SpoolArt } from "@/components/GarmentArt";
import CheckStatusForm from "@/components/CheckStatusForm";
import PulseFitHeroDemo from "@/components/ui/pulse-fit-hero-demo";

const WA_LINK = "https://wa.me/6281234567890";

const NAV = [
  { href: "#beranda", label: "Beranda" },
  { href: "#layanan", label: "Layanan" },
  { href: "#galeri", label: "Galeri" },
  { href: "#tentang", label: "Tentang" },
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
  { name: "Kebaya Modern", category: "Pesta & Adat", art: <KebayaArt className="h-24 w-24" />, bg: "from-amber-50 to-rose-100 text-[#b98a2f]" },
  { name: "Jas Pengantin", category: "Formal", art: <JacketArt className="h-24 w-24" />, bg: "from-slate-100 to-slate-200 text-slate-700" },
  { name: "Gaun Pesta", category: "Evening Wear", art: <DressArt className="h-24 w-24" />, bg: "from-rose-50 to-fuchsia-100 text-rose-500" },
  { name: "Kemeja Formal", category: "Harian & Kerja", art: <ShirtArt className="h-24 w-24" />, bg: "from-blue-50 to-indigo-100 text-blue-600" },
  { name: "Gamis Premium", category: "Religi & Santai", art: <GamisArt className="h-24 w-24" />, bg: "from-emerald-50 to-teal-100 text-emerald-700" },
  { name: "Seragam Kantor", category: "Korporat", art: <SpoolArt className="h-24 w-24" />, bg: "from-orange-50 to-amber-100 text-orange-600" },
];

const TESTIMONIALS = [
  {
    name: "Sarah Amelia",
    role: "Pengantin 2025",
    quote:
      "Kebaya akad nikah saya jahit di sini dan hasilnya luar biasa. Ukurannya pas sekali dan detail rendanya rapi banget.",
  },
  {
    name: "Hendra Gunawan",
    role: "Pemilik Restoran",
    quote:
      "Order 40 seragam staf dan semuanya selesai tepat waktu. Kualitas jahitan seragam dari potongan pertama sampai terakhir.",
  },
  {
    name: "Maria Krisdayanti",
    role: "Pelanggan Sejak 2021",
    quote:
      "Fitur cek status pesanannya bikin tenang — tinggal masukkan kode, langsung kelihatan bajunya sudah sampai mana.",
  },
];

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-slate-500">{subtitle}</p>}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main id="beranda" className="bg-white">
      {/* PulseFit / Framer Motion Hero Section */}
      <PulseFitHeroDemo />

      {/* Layanan */}
      <section id="layanan" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Layanan Kami"
            title="Semua kebutuhan jahit dalam satu tempat"
            subtitle="Fokus pada detail, bahan berkualitas, dan komunikasi yang jelas dari awal sampai pesanan selesai."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand-dark transition group-hover:bg-brand group-hover:text-white">
                  {s.icon}
                </span>
                <h3 className="mt-5 text-base font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri */}
      <section id="galeri" className="bg-stone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Galeri"
            title="Hasil karya terbaru"
            subtitle="Sebagian pekerjaan yang paling kami banggakan dari mejajahit Arunika."
          />
          <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-3">
            {GALLERY.map((g) => (
              <figure
                key={g.name}
                className={`group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${g.bg} shadow-sm transition duration-300 hover:shadow-xl`}
              >
                <div className="transition-transform duration-300 group-hover:scale-110">{g.art}</div>
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-white/90 px-4 py-3 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                  <p className="text-sm font-semibold text-slate-900">{g.name}</p>
                  <p className="text-xs text-slate-500">{g.category}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section id="tentang" className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative mx-auto flex h-80 w-full max-w-md items-center justify-center rounded-3xl bg-gradient-to-br from-brand/15 via-amber-50 to-rose-50 shadow-inner">
            <SpoolArt className="h-40 w-40 text-brand-dark" />
            <span className="absolute right-6 top-6 rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow ring-1 ring-black/5">
              Sejak 2014
            </span>
          </div>
          <div>
            <SectionHeading
              eyebrow="Tentang Kami"
              title="Mejajahit kecil dengan standar besar"
            />
            <div className="mt-6 space-y-4 leading-relaxed text-slate-500">
              <p>
                Arunika Tailor berawal dari satu mesin jahit di ruang tamu rumah di Pontianak.
                Dua belas tahun kemudian, kami telah menyelesaikan lebih dari tiga ribu pesanan —
                dari gaun pesta, kebaya adat, sampai seragam seluruh staf restoran.
              </p>
              <p>
                Kami percaya baju yang baik lahir dari pengukuran yang cermat dan komunikasi yang
                jujur. Setiap pesanan dikerjakan satu tukang jahit dari awal hingga akhir, sehingga
                kualitasnya konsisten dan tanggung jawabnya jelas.
              </p>
            </div>
            <ul className="mt-8 space-y-3">
              {[
                "Pengukuran gratis untuk pelanggan baru",
                "Perbaikan ulang jika ukuran tidak pas*",
                "Update status pesanan secara online",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-400">
              *Berlaku untuk kesalahan produksi dari sisi kami.
            </p>
          </div>
        </div>
      </section>

      {/* Cek Status */}
      <section id="cek-status" className="relative overflow-hidden bg-slate-900 py-20 lg:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">Cek Status Pesanan</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
            Bajumu sudah sampai mana?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300">
            Masukkan kode pembelian 6 huruf yang Anda terima saat memesan untuk melihat posisi
            pesanan secara real-time.
          </p>
          <div className="mt-10 text-left">
            <CheckStatusForm />
          </div>
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Testimoni"
            title="Apa kata pelanggan"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand/30 to-rose-200 text-sm font-bold text-brand-dark">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Kontak / Footer */}
      <footer id="kontak" className="border-t border-slate-800 bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <a href="#beranda" className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white">
                  <NeedleLogo className="h-5 w-5" />
                </span>
                <span className="font-display text-lg font-semibold text-white">
                  Arunika <span className="text-brand">Tailor</span>
                </span>
              </a>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                Jasa penjahitan premium di Pontianak untuk pakaian custom, seragam, dan perbaikan
                pakaian Anda.
              </p>
              <div className="mt-5 flex gap-3">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:border-brand hover:text-brand"
                >
                  <ChatIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com/arunika.tailor"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:border-brand hover:text-brand"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="tel:+6281234567890"
                  aria-label="Telepon"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition hover:border-brand hover:text-brand"
                >
                  <PhoneIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Kontak</h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  Jl. Gajah Mada No. 88, Pontianak Tenggara, Kota Pontianak, Kalimantan Barat 78121
                </li>
                <li className="flex gap-3">
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  +62 812-3456-7890
                </li>
                <li className="flex gap-3">
                  <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  Senin – Sabtu, 09.00 – 17.00 WIB
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Navigasi</h3>
              <ul className="mt-5 space-y-3 text-sm">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="text-slate-400 transition hover:text-brand">
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="/login" className="text-slate-600 transition hover:text-slate-400">
                    Login Admin
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 border-t border-slate-800 pt-6 text-xs text-slate-500">
            © {new Date().getFullYear()} Arunika Tailor Pontianak. Semua hak dilindungi.
          </div>
        </div>
      </footer>
    </main>
  );
}
