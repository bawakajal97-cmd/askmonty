"use client";
import useUser from "@/utils/useUser";
import { useLanguage } from "@/utils/LanguageContext";
import { ArrowRight, Check, LayoutDashboard } from "lucide-react";

const AMBER = "#EF9F27";

export default function LandingPage() {
  const { data: user } = useUser();
  const { lang, toggleLang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 border-b border-[#F3F4F6] bg-white/95 px-6 py-4"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <span className="text-3xl leading-none">🐑</span>
            <span className="text-xl font-black tracking-tight text-[#111827]">
              AskMonty
            </span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/pricing"
              className="hidden text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors sm:block"
            >
              {t.nav_pricing}
            </a>
            <a
              href="/referral"
              className="hidden text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors sm:block"
            >
              {t.nav_refer}
            </a>
            <button
              onClick={toggleLang}
              className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#111827] transition-all"
            >
              {lang === "en" ? "🇫🇷 FR" : "🇬🇧 EN"}
            </button>
            <a
              href={user ? "/chat" : "/account/signin"}
              className="rounded-full px-5 py-2 text-sm font-black text-white transition-all hover:opacity-90"
              style={{ backgroundColor: AMBER }}
            >
              {user ? t.nav_chat : t.nav_signin}
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-24 pb-32 text-center">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="h-[500px] w-[500px] rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${AMBER}, transparent 70%)`,
            }}
          />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FDE68A] bg-[#FEF9EE] px-4 py-2 text-sm font-semibold text-[#92400E]">
            {t.hero_eyebrow}
          </div>
          <div className="mb-8 text-8xl md:text-[120px] leading-none select-none">
            🐑
          </div>
          <h1 className="mb-6 text-5xl font-black tracking-tight text-[#111827] md:text-7xl leading-tight">
            {t.hero_title_1}
            <br />
            <span style={{ color: AMBER }}>{t.hero_title_2}</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#4B5563] leading-relaxed">
            {t.hero_sub}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/chat"
              className="flex items-center gap-2 rounded-full px-8 py-4 text-base font-black text-white shadow-lg transition-all hover:opacity-90 hover:scale-105"
              style={{
                backgroundColor: AMBER,
                boxShadow: `0 4px 24px ${AMBER}55`,
              }}
            >
              {t.hero_cta} <ArrowRight size={18} />
            </a>
            <a
              href="#how"
              className="rounded-full border-2 border-[#E5E7EB] bg-white px-8 py-4 text-base font-bold text-[#374151] hover:border-[#EF9F27] transition-all"
            >
              {t.hero_cta2}
            </a>
          </div>
          <p className="mt-5 text-xs text-[#9CA3AF]">
            {lang === "en"
              ? "No credit card. No sign-up. Just ask."
              : "Pas de carte. Pas d'inscription. Pose simplement ta question."}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#FAFAF8] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-4xl font-black text-[#111827]">
            {t.features_title}
          </h2>
          <p className="mb-16 text-center text-[#6B7280]">
            {lang === "en"
              ? "Everything you wanted to ask but didn't know who to ask."
              : "Tout ce que tu voulais demander mais ne savais pas à qui."}
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: "💰", title: t.feat1_title, desc: t.feat1_desc },
              { emoji: "📋", title: t.feat2_title, desc: t.feat2_desc },
              { emoji: "🏦", title: t.feat3_title, desc: t.feat3_desc },
              { emoji: "✈️", title: t.feat4_title, desc: t.feat4_desc },
            ].map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border-2 border-[#E5E7EB] bg-white p-6 transition-all hover:border-[#EF9F27] hover:shadow-md"
              >
                <div className="mb-4 text-3xl">{f.emoji}</div>
                <h3 className="mb-2 text-base font-black text-[#111827]">
                  {f.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-16 text-center text-4xl font-black text-[#111827]">
            {t.how_title}
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                num: "1",
                emoji: "💬",
                title: t.step1_title,
                desc: t.step1_desc,
              },
              {
                num: "2",
                emoji: "🧠",
                title: t.step2_title,
                desc: t.step2_desc,
              },
              {
                num: "3",
                emoji: "🤝",
                title: t.step3_title,
                desc: t.step3_desc,
              },
            ].map((s) => (
              <div key={s.num} className="text-center">
                <div
                  className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full text-white text-xl font-black"
                  style={{ backgroundColor: AMBER }}
                >
                  {s.num}
                </div>
                <div className="mb-3 text-3xl">{s.emoji}</div>
                <h3 className="mb-2 text-lg font-black text-[#111827]">
                  {s.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-[#FAFAF8] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-4xl font-black text-[#111827]">
            {t.pricing_title}
          </h2>
          <p className="mb-16 text-center text-[#6B7280]">
            {lang === "en"
              ? "Start free. Upgrade when Monty needs to remember you."
              : "Commence gratuitement. Passe à la vitesse supérieure quand Monty doit se souvenir de toi."}
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            {/* Free */}
            <div className="rounded-2xl border-2 border-[#E5E7EB] bg-white p-7">
              <div className="mb-2 inline-block rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#6B7280]">
                {t.plan_free}
              </div>
              <div className="my-5 flex items-baseline gap-1">
                <span className="text-5xl font-black text-[#111827]">€0</span>
                <span className="text-[#6B7280]">{t.per_month}</span>
              </div>
              <ul className="mb-8 space-y-3">
                {[t.free_f1, t.free_f2, t.free_f3].map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-[#6B7280]"
                  >
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-[#9CA3AF]"
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/chat"
                className="block w-full rounded-full border-2 border-[#E5E7EB] py-3 text-center text-sm font-black text-[#374151] hover:border-[#EF9F27] hover:text-[#EF9F27] transition-all"
              >
                {t.free_cta}
              </a>
            </div>

            {/* Monty Remembers €9 */}
            <div
              className="relative rounded-2xl p-7 text-white"
              style={{ backgroundColor: AMBER }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#111827] px-4 py-1 text-xs font-black text-white">
                {t.premium_badge}
              </div>
              <div className="mb-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider">
                {t.plan_premium}
              </div>
              <div className="my-5 flex items-baseline gap-1">
                <span className="text-5xl font-black">€9</span>
                <span className="text-white/80">{t.per_month}</span>
              </div>
              <ul className="mb-8 space-y-3">
                {[t.prem_f1, t.prem_f2, t.prem_f3, t.prem_f4].map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-white/90"
                  >
                    <Check size={15} className="mt-0.5 shrink-0 text-white" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/pricing"
                className="block w-full rounded-full bg-white py-3 text-center text-sm font-black transition-all hover:bg-[#FEF9EE]"
                style={{ color: AMBER }}
              >
                {t.prem_cta}
              </a>
            </div>

            {/* Monty Manages €19 */}
            <div className="relative rounded-2xl border-2 border-[#111827] bg-[#111827] p-7 text-white">
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-black text-white"
                style={{ backgroundColor: AMBER }}
              >
                {lang === "en" ? "NEW" : "NOUVEAU"}
              </div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider">
                <LayoutDashboard size={11} /> Monty Manages
              </div>
              <div className="my-5 flex items-baseline gap-1">
                <span className="text-5xl font-black">€19</span>
                <span className="text-white/50">{t.per_month}</span>
              </div>
              <ul className="mb-8 space-y-3">
                {[
                  lang === "en"
                    ? "Everything in Monty Remembers"
                    : "Tout ce qu'inclut Remembers",
                  lang === "en"
                    ? "Spending tracker dashboard"
                    : "Tableau de bord des dépenses",
                  lang === "en"
                    ? "Savings goal tracker"
                    : "Suivi d'objectif d'épargne",
                  lang === "en"
                    ? "Monty's personalised monthly nudge"
                    : "Nudge mensuel personnalisé de Monty",
                ].map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-white/80"
                  >
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0"
                      style={{ color: AMBER }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/pricing"
                className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-center text-sm font-black text-[#111827] transition-all hover:opacity-90"
                style={{ backgroundColor: AMBER }}
              >
                {lang === "en" ? "Get Monty Manages" : "Démarrer Monty Manages"}{" "}
                <LayoutDashboard size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">🐑</span>
            <h3 className="text-xl font-black text-[#92400E]">
              {t.limitations_title}
            </h3>
          </div>
          <ul className="space-y-3">
            {[t.lim1, t.lim2, t.lim3].map((l, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-[#78350F]"
              >
                <span className="mt-0.5 font-bold" style={{ color: AMBER }}>
                  →
                </span>
                {l}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FAFAF8] px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-4xl font-black text-[#111827]">
            {t.faq_title}
          </h2>
          <div className="space-y-3">
            {[
              { q: t.faq1_q, a: t.faq1_a },
              { q: t.faq2_q, a: t.faq2_a },
              { q: t.faq3_q, a: t.faq3_a },
              { q: t.faq4_q, a: t.faq4_a },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-[#E5E7EB] bg-white p-6 hover:border-[#EF9F27] transition-all"
              >
                <h3 className="mb-2 font-black text-[#111827]">{item.q}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral callout */}
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl border-2 border-dashed border-[#FDE68A] bg-[#FEF9EE] p-8 text-center">
          <div className="text-3xl mb-3">🎁</div>
          <h3 className="mb-2 text-lg font-black text-[#92400E]">
            {t.nav_refer}
          </h3>
          <p className="mb-4 text-sm text-[#78350F]">
            {lang === "en"
              ? "Know someone who'd love Monty? Share your link and help them find their finance friend."
              : "Tu connais quelqu'un qui adorerait Monty ? Partage ton lien de parrainage."}
          </p>
          <a
            href="/referral"
            className="inline-block rounded-full px-6 py-2.5 text-sm font-black text-white transition-all hover:opacity-90"
            style={{ backgroundColor: AMBER }}
          >
            {lang === "en" ? "Get my referral link" : "Obtenir mon lien"}
          </a>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#FAFAF8] px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 text-6xl">🐑</div>
          <h2 className="mb-4 text-4xl font-black text-[#111827]">
            {t.cta_title}
          </h2>
          <p className="mb-8 text-[#6B7280]">{t.cta_sub}</p>
          <a
            href="/chat"
            className="inline-flex items-center gap-2 rounded-full px-10 py-4 text-lg font-black text-white transition-all hover:opacity-90 hover:scale-105"
            style={{
              backgroundColor: AMBER,
              boxShadow: `0 4px 24px ${AMBER}55`,
            }}
          >
            {t.cta_btn} <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐑</span>
            <span className="text-sm font-black text-[#111827]">AskMonty</span>
            <span className="text-xs text-[#9CA3AF]">{t.footer_tagline}</span>
          </div>
          <div className="flex gap-6">
            {[
              [t.footer_legal, "/legal"],
              [t.footer_privacy, "/privacy"],
              [t.footer_contact, "#"],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                className="text-xs text-[#9CA3AF] hover:text-[#111827] transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
          <p className="text-xs text-[#9CA3AF]">© {t.footer_rights}</p>
        </div>
      </footer>
    </div>
  );
}
