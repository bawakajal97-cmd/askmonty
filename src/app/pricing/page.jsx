"use client";
import { useEffect, useCallback } from "react";
import useUser from "@/utils/useUser";
import { useLanguage } from "@/utils/LanguageContext";
import { Check, ArrowLeft, CreditCard, LayoutDashboard } from "lucide-react";

const AMBER = "#EF9F27";

export default function PricingPage() {
  const { data: userData, loading: userLoading, refetch } = useUser();
  const { lang, toggleLang, t } = useLanguage();
  const isFr = lang === "fr";
  const user = userData?.user;
  const tier = user?.subscription_tier;

  // After Stripe redirect, poll for updated subscription status
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (!params.get("session_id")) return;

    let attempts = 0;
    const maxAttempts = 8;
    const poll = async () => {
      if (attempts >= maxAttempts) return;
      attempts++;
      try {
        await fetch("/api/get-subscription-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ forceRefresh: true }),
        });
        if (refetch) refetch();
      } catch (_) {}
      if (attempts < maxAttempts) setTimeout(poll, 2500);
    };
    poll();
  }, [refetch]);

  const handleSubscribe = useCallback(
    async (planTier) => {
      if (!user) {
        window.location.href = "/account/signin?next=/pricing";
        return;
      }
      try {
        const res = await fetch("/api/stripe-checkout-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            redirectURL: window.location.href,
            tier: planTier,
          }),
        });
        const data = await res.json();
        if (data.url) window.open(data.url, "_blank", "popup");
      } catch (_) {}
    },
    [user],
  );

  const isActive = (planTier) =>
    planTier === "manages"
      ? tier === "manages"
      : tier === "remembers" || tier === "manages";

  return (
    <div className="min-h-screen bg-white font-inter">
      <nav className="border-b border-[#F3F4F6] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft size={16} /> {t.nav_back}
          </a>
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐑</span>
            <span className="text-lg font-black text-[#111827]">AskMonty</span>
          </a>
          <button
            onClick={toggleLang}
            className="rounded-full border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#6B7280] hover:border-[#EF9F27] transition-all"
          >
            {lang === "en" ? "🇫🇷 FR" : "🇬🇧 EN"}
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 text-center">
          <div className="mb-4 text-6xl">🐑</div>
          <h1 className="mb-3 text-4xl font-black text-[#111827]">
            {t.pricing_page_title}
          </h1>
          <p className="text-lg text-[#6B7280]">{t.pricing_page_sub}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3 mb-10">
          {/* Free */}
          <div className="rounded-2xl border-2 border-[#E5E7EB] bg-white p-7">
            <div className="mb-2 inline-block rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#6B7280]">
              {t.plan_free}
            </div>
            <div className="my-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-[#111827]">€0</span>
              <span className="text-[#6B7280] text-sm">{t.per_month}</span>
            </div>
            <ul className="mb-6 space-y-2.5">
              {[t.free_f1, t.free_f2, t.free_f3].map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[#6B7280]"
                >
                  <Check size={14} className="mt-0.5 shrink-0 text-[#9CA3AF]" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="/chat"
              className="block w-full rounded-full border-2 border-[#E5E7EB] py-2.5 text-center text-sm font-black text-[#374151] hover:border-[#EF9F27] hover:text-[#EF9F27] transition-all"
            >
              {t.free_cta}
            </a>
          </div>

          {/* Premium €9 */}
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
            <div className="my-4 flex items-baseline gap-1">
              <span className="text-4xl font-black">€9</span>
              <span className="text-white/70 text-sm">{t.per_month}</span>
            </div>
            <ul className="mb-6 space-y-2.5">
              {[t.prem_f1, t.prem_f2, t.prem_f3, t.prem_f4].map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-white/90"
                >
                  <Check size={14} className="mt-0.5 shrink-0 text-white" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe("remembers")}
              disabled={userLoading || isActive("remembers")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-2.5 text-sm font-black transition-all hover:bg-[#FEF9EE] disabled:opacity-60"
              style={{ color: AMBER }}
            >
              {isActive("remembers") ? (
                <>
                  {isFr ? "Actif" : "Active"} <Check size={16} />
                </>
              ) : (
                <>
                  {t.prem_cta} <CreditCard size={15} />
                </>
              )}
            </button>
          </div>

          {/* Monty Manages €19 */}
          <div className="relative rounded-2xl border-2 border-[#111827] bg-[#111827] p-7 text-white">
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-black text-white"
              style={{ backgroundColor: AMBER }}
            >
              {isFr ? "NOUVEAU" : "NEW"}
            </div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider">
              <LayoutDashboard size={11} /> Monty Manages
            </div>
            <div className="my-4 flex items-baseline gap-1">
              <span className="text-4xl font-black">€19</span>
              <span className="text-white/50 text-sm">{t.per_month}</span>
            </div>
            <ul className="mb-6 space-y-2.5">
              {[
                isFr
                  ? "Tout ce qu'inclut Monty Remembers"
                  : "Everything in Monty Remembers",
                isFr
                  ? "Tableau de bord des dépenses"
                  : "Spending tracker dashboard",
                isFr ? "Suivi d'objectif d'épargne" : "Savings goal tracker",
                isFr
                  ? "Nudge mensuel personnalisé de Monty"
                  : "Monty's personalised monthly nudge",
              ].map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-white/80"
                >
                  <Check
                    size={14}
                    className="mt-0.5 shrink-0"
                    style={{ color: AMBER }}
                  />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe("manages")}
              disabled={userLoading || tier === "manages"}
              className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-black text-[#111827] transition-all hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: AMBER }}
            >
              {tier === "manages" ? (
                <>
                  {isFr ? "Actif" : "Active"} <Check size={16} />
                </>
              ) : (
                <>
                  {isFr ? "Démarrer Monty Manages" : "Get Monty Manages"}{" "}
                  <LayoutDashboard size={15} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Limitations */}
        <div className="mb-8 rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xl">🐑</span>
            <h3 className="font-black text-[#92400E]">{t.limitations_title}</h3>
          </div>
          <ul className="space-y-3">
            {[t.lim1, t.lim2, t.lim3].map((l, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[#78350F]"
              >
                <span className="font-bold mt-0.5" style={{ color: AMBER }}>
                  →
                </span>
                {l}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { emoji: "🧠", q: t.pricing_how_q, a: t.pricing_how_a },
            { emoji: "✌️", q: t.pricing_cancel_q, a: t.pricing_cancel_a },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-[#E5E7EB] p-5 hover:border-[#EF9F27] transition-all"
            >
              <div className="mb-2 text-2xl">{item.emoji}</div>
              <h3 className="mb-1.5 font-black text-[#111827]">{item.q}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
