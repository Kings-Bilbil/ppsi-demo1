"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STATUSES, type Status } from "@/lib/constants";
import { api } from "@/lib/client";
import { formatDateTime, formatIDR } from "@/lib/format";

// Images — real tailor/fashion photography
const MACRO_BG = "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80&auto=format&fit=crop"; // penjahit / fabric

const SLICES = [
  {
    id: "A.01",
    num: "A.01",
    short: "Kebaya Modern",
    title: "Kebaya Modern & Akad Nikah",
    mono: "A.01 / Pesta & Adat",
    desc: "Kebaya modern dengan detail renda dan payet presisi, dirancang khusus untuk momen akad nikah yang sakral dan elegan.",
    img: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "A.02",
    num: "A.02",
    short: "Jas Pengantin",
    title: "Jas Pengantin & Tuxedo",
    mono: "A.02 / Formal & Pesta",
    desc: "Potongan jas yang tegas dan rapi, menjaga siluet tetap proporsional untuk hari penting Anda.",
    img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "A.03",
    num: "A.03",
    short: "Gaun Pesta",
    title: "Gaun Pesta & Evening Wear",
    mono: "A.03 / Evening Wear",
    desc: "Gaun pesta dengan draperi lembut dan jahitan halus yang mengutamakan kenyamanan serta keanggunan.",
    img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "A.04",
    num: "A.04",
    short: "Kemeja Formal",
    title: "Kemeja Formal Custom",
    mono: "A.04 / Harian & Kerja",
    desc: "Kemeja sesuai ukuran tubuh dengan pemilihan bahan dan detail kerah yang disesuaikan selera Anda.",
    img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80&auto=format&fit=crop",
  },
];

const MATRIX_TABS = [
  {
    key: "core",
    num: "01.",
    name: "JAHITAN CUSTOM",
    caption: "FIG. 01 / JAHITAN CUSTOM",
    desc: "Baju dibuat khusus sesuai ukuran tubuh dan selera Anda — kemeja, gaun, kebaya, hingga jas dengan presisi tinggi.",
    img: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=900&q=80&auto=format&fit=crop",
  },
  {
    key: "fluidics",
    num: "02.",
    name: "UKUR & PERBAIKAN",
    caption: "FIG. 02 / UKUR & PERBAIKAN",
    desc: "Mengecilkan, memanjangkan, atau merombak pakaian agar jatuhnya sempurna di badan tanpa mengubah karakter desain.",
    img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&q=80&auto=format&fit=crop",
  },
  {
    key: "sync",
    num: "03.",
    name: "SERAGAM & ORDERAN",
    caption: "FIG. 03 / SERAGAM & ORDERAN",
    desc: "Seragam kantor, komunitas, dan acara dengan hasil konsisten untuk puluhan potong — tepat waktu dan rapi.",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&q=80&auto=format&fit=crop",
  },
];

export default function NexusLanding() {
  const [activeSlice, setActiveSlice] = useState<string | null>(null);
  const [matrixKey, setMatrixKey] = useState("core");
  const [hoverCapable, setHoverCapable] = useState(false);
  useEffect(() => {
    setHoverCapable(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [detail, setDetail] = useState<null | {
    buyerName: string;
    stockName: string;
    quantity: number;
    totalPrice: number;
    description: string | null;
    purchaseCode: string;
    createdAt: string;
    updatedAt: string;
    status: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressPctRef = useRef<HTMLSpanElement>(null);
  const navUpRef = useRef<HTMLButtonElement>(null);
  const navDownRef = useRef<HTMLButtonElement>(null);

  // z-depth scroll + progress (same engine as template)
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".zcard"));
    const hudFill = progressFillRef.current;
    const hudPct = progressPctRef.current;
    const navUp = navUpRef.current;
    const navDown = navDownRef.current;
    let vh = window.innerHeight;
    let ticking = false;
    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

    function renderEngine() {
      const y = window.scrollY || window.pageYOffset || 0;
      for (let i = 0; i < cards.length; i++) {
        const entry = i === 0 ? 1 : clamp01((y - (i - 1) * vh) / vh);
        const recede = i === cards.length - 1 ? 0 : clamp01((y - i * vh) / vh);
        const scale = 1 - 0.1 * recede;
        const ty = (1 - entry) * 100;
        cards[i].style.transform = `translateY(${ty}%) scale(${scale})`;
        cards[i].style.opacity = String(1 - 0.6 * recede);
      }
    }
    function renderProgress() {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = clamp01((window.scrollY || window.pageYOffset || 0) / max);
      if (hudFill) hudFill.style.width = `${p * 100}%`;
      if (hudPct) hudPct.textContent = `${String(Math.round(p * 100)).padStart(3, "0")}%`;
      if (navUp) navUp.disabled = p <= 0.001;
      if (navDown) navDown.disabled = p >= 0.999;
    }
    function onFrame() {
      if (!reduceMotion) renderEngine();
      renderProgress();
      ticking = false;
    }
    function requestRender() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onFrame);
      }
    }
    const onScroll = () => requestRender();
    const onResize = () => {
      vh = window.innerHeight;
      requestRender();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    requestRender();
    const t = setTimeout(requestRender, 3000);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const gotoCard = (index: number) => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".zcard"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const i = Math.max(0, Math.min(cards.length - 1, index));
    const vh = window.innerHeight;
    if (reduceMotion) {
      const top = cards[i].getBoundingClientRect().top + (window.scrollY || 0);
      window.scrollTo(0, top);
    } else {
      window.scrollTo({ top: i * vh, behavior: "smooth" });
    }
  };

  const currentIndex = status ? STATUSES.indexOf(status) : -1;

  const check = useCallback(
    async (silent: boolean) => {
      if (!silent) setLoading(true);
      try {
        const res = await api<{
          status: string;
          buyerName: string;
          stockName: string;
          quantity: number;
          totalPrice: number;
          description: string | null;
          purchaseCode: string;
          createdAt: string;
          updatedAt: string;
        }>("/api/check-status", {
          method: "POST",
          body: JSON.stringify({ code: code.trim() }),
        });
        setStatus(res.status as Status);
        setDetail(res as unknown as typeof detail);
        setError(null);
        setCheckedAt(new Date());
      } catch (e) {
        setStatus(null);
        setDetail(null);
        setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
        setCheckedAt(null);
      } finally {
        setLoading(false);
      }
    },
    [code]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timerRef.current) clearInterval(timerRef.current);
    if (!/^[A-Za-z]{6}$/.test(code.trim())) {
      setStatus(null);
      setDetail(null);
      setError("Masukkan kode pembelian 6 huruf.");
      setCheckedAt(null);
      return;
    }
    void check(false).then(() => {
      timerRef.current = setInterval(() => {
        if (document.visibilityState === "visible") void check(true);
      }, 15000);
    });
  };

  return (
    <>
      <div className="scroll-spacer" aria-hidden="true" />
      {/* Card 1 - Hero */}
      <section className="zcard card-hero" data-card="1">
        <div className="hero-grid" aria-hidden="true" />
        <div className="glass-shape glass-a" aria-hidden="true" />
        <div className="glass-shape glass-b" aria-hidden="true" />
        <div className="glass-shape glass-c" aria-hidden="true" />
        <div className="hero-stage">
          <p className="hero-eyebrow">Penjahit Custom Pontianak</p>
          <h1 className="hero-title">ARUNIKA</h1>
          <p className="hero-sub">
            Setiap potong dikerjakan dengan cermat, bahan pilihan, dan transparansi status pesanan real-time.
          </p>
        </div>
        <div className="hero-scroll-hint">Scroll untuk melanjutkan</div>
      </section>

      {/* Card 2 - Cek Status Pesanan (same animation structure as template macro) */}
      <section className="zcard card-macro" data-card="2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="macro-img" src={MACRO_BG} alt="Latar penjahit profesional — kain dan mesin jahit" />
        <div className="macro-shade" aria-hidden="true" />
        <div className="crosshair-v" aria-hidden="true" />
        <div className="crosshair-h" aria-hidden="true" />
        <div className="node-dot" aria-hidden="true" />
        <div className="macro-caption">
          <span className="mono">02 / Cek Status Pesanan</span>
          <h2>Lacak pesananmu secara real-time.</h2>
          <p>Masukkan kode pembelian 6 huruf yang Anda terima saat memesan untuk melihat status pengerjaan pesanan Anda.</p>
        </div>
        <div className="cek-panel">
          <p className="cek-panel-tag">CEK STATUS / KODE 6 HURUF</p>
          <h3>Cek status pesanan</h3>
          <p className="cek-panel-desc">Contoh: kR7mQw — status diperbarui otomatis tiap 15 detik.</p>
          <form onSubmit={onSubmit} className="cek-form">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="kR7mQw"
              maxLength={6}
              aria-label="Kode pembelian"
              className="cek-input"
            />
            <button type="submit" disabled={loading} className="cek-btn">
              {loading ? "Memeriksa..." : "Cek Status"}
            </button>
          </form>
          {error && <div className="cek-error">{error}</div>}
          {status && detail && (
            <div className="cek-result">
              <div className="cek-result-head">
                <span style={{ fontSize: 12, color: "#64748b" }}>Status pesanan</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "4px 8px",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                  }}
                >
                  {status}
                </span>
              </div>
              <div className="cek-steps">
                {STATUSES.map((s, i) => {
                  const done = i <= currentIndex;
                  const isLast = i === STATUSES.length - 1;
                  return (
                    <div key={s} className="cek-step" style={{ flex: isLast ? "0 0 auto" : 1 }}>
                      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <span className={`cek-dot ${done ? "done" : ""}`}>{i + 1}</span>
                        {!isLast && <span className={`cek-line ${i < currentIndex ? "done" : ""}`} />}
                      </div>
                      <span className={`cek-label ${done ? "done" : ""}`}>{s}</span>
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  marginTop: 14,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  padding: 10,
                  fontSize: 12,
                  lineHeight: 1.6,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Nama</span>
                  <span style={{ fontWeight: 600 }}>{detail.buyerName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Jenis Baju</span>
                  <span style={{ fontWeight: 600 }}>{detail.stockName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Jumlah</span>
                  <span style={{ fontWeight: 600 }}>{detail.quantity} pcs</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Total</span>
                  <span style={{ fontWeight: 700 }}>{formatIDR(detail.totalPrice)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Kode</span>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 600 }}>{detail.purchaseCode}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Tanggal Pesan</span>
                  <span style={{ fontWeight: 600 }}>{formatDateTime(detail.createdAt)}</span>
                </div>
                {detail.description && (
                  <div style={{ marginTop: 8, borderTop: "1px solid #e2e8f0", paddingTop: 8 }}>
                    <span style={{ color: "#64748b", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Deskripsi</span>
                    <p style={{ marginTop: 4 }}>{detail.description}</p>
                  </div>
                )}
              </div>
              <p style={{ marginTop: 10, fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
                Diperbarui otomatis tiap 15 detik{checkedAt && ` • ${checkedAt.toLocaleTimeString("id-ID")}`}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Card 3 - Galeri / Accordion */}
      <section className="zcard card-fold" data-card="3">
        <div className="fold-head">
          <h2>Hasil pengerjaan busana terbaru</h2>
          <span className="mono">03 / Arahkan atau ketuk kolom</span>
        </div>
        <div className="accordion" id="nexus-accordion">
          {SLICES.map((s) => (
            <button
              key={s.id}
              className={`slice ${activeSlice === s.id ? "active" : ""}`}
              type="button"
              aria-expanded={activeSlice === s.id ? "true" : "false"}
              onMouseEnter={() => {
                if (hoverCapable) setActiveSlice(s.id);
              }}
              onFocus={() => setActiveSlice(s.id)}
              onClick={() => setActiveSlice((prev) => (prev === s.id ? null : s.id))}
              onMouseLeave={() => {
                if (hoverCapable) setActiveSlice(null);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="slice-img" src={s.img} alt={s.title} />
              <div className="slice-shade" aria-hidden="true" />
              <div className="slice-idle">
                <span className="slice-num">{s.num}</span>
                <span className="slice-idle-title">{s.short}</span>
                <span className="slice-num" aria-hidden="true">
                  +
                </span>
              </div>
              <div className="slice-reveal">
                <span className="mono">{s.mono}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Card 4 - Matrix layanan */}
      <section className="zcard card-matrix" data-card="4">
        <div className="matrix-left">
          <p className="mono-tag">04 / Di dalam layanan</p>
          <h2>Semua kebutuhan jahit dalam satu tempat.</h2>
          <div className="matrix-tabs">
            {MATRIX_TABS.map((t) => (
              <button
                key={t.key}
                className={`matrix-tab ${matrixKey === t.key ? "active" : ""}`}
                type="button"
                data-goto={t.key}
                aria-selected={matrixKey === t.key ? "true" : "false"}
                onClick={() => setMatrixKey(t.key)}
              >
                <span className="tab-line">
                  <span className="tab-num">{t.num}</span>
                  <span className="tab-name">{t.name}</span>
                </span>
                <p>{t.desc}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="matrix-right">
          {MATRIX_TABS.map((t) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={t.key} className={`matrix-img ${matrixKey === t.key ? "active" : ""}`} data-panel={t.key} src={t.img} alt={t.name} />
          ))}
          <div className="matrix-img-shade" aria-hidden="true" />
          <div className="matrix-caption" id="matrixCaption">
            {MATRIX_TABS.find((t) => t.key === matrixKey)?.caption}
          </div>
        </div>
      </section>

      {/* HUD */}
      <footer className="hud">
        <span className="hud-brand">
          <span className="dot" aria-hidden="true" />
          AkasaID
        </span>
        <div className="hud-progress">
          <div className="hud-track">
            <div className="hud-fill" ref={progressFillRef} id="hudFill" />
          </div>
          <span className="hud-pct" ref={progressPctRef} id="hudPct">
            000%
          </span>
        </div>
        <div className="hud-nav">
          <button
            ref={navUpRef}
            className="hud-arrow"
            id="navUp"
            type="button"
            aria-label="Sebelumnya"
            onClick={() => {
              const y = window.scrollY || 0;
              const vh = window.innerHeight;
              gotoCard(Math.ceil(y / vh - 0.001) - 1);
            }}
          >
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 9L7 4L12 9" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            ref={navDownRef}
            className="hud-arrow"
            id="navDown"
            type="button"
            aria-label="Selanjutnya"
            onClick={() => {
              const y = window.scrollY || 0;
              const vh = window.innerHeight;
              gotoCard(Math.floor(y / vh + 0.001) + 1);
            }}
          >
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </footer>
    </>
  );
}
