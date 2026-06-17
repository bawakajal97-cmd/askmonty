"use client";
import { useState, useEffect, useCallback } from "react";
import useUser from "@/utils/useUser";
import { useLanguage } from "@/utils/LanguageContext";
import { ArrowLeft, Copy, Check, Twitter, Send } from "lucide-react";

const AMBER = "#EF9F27";

export default function ReferralPage() {
  const { data: userData, isLoading: userLoading } = useUser();
  const { lang, toggleLang, t } = useLanguage();
  const [referralCode, setReferralCode] = useState(null);
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReferral = useCallback(async () => {
    if (!userData?.user) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/referral");
      if (!res.ok) throw new Error("Failed to fetch referral");
      const data = await res.json();
      setReferralCode(data.code);
      setReferralCount(data.referral_count || 0);
    } catch (err) {
      console.error(err);
      setError(
        lang === "en"
          ? "Couldn't load your referral link."
          : "Impossible de charger ton lien de parrainage.",
      );
    } finally {
      setLoading(false);
    }
  }, [userData, lang]);

  useEffect(() => {
    fetchReferral();
  }, [fetchReferral]);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://askmonty.com";
  const referralUrl = referralCode ? `${baseUrl}?ref=${referralCode}` : "";

  const handleCopy = async () => {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {}
  };

  const tweetText =
    lang === "en"
      ? `Just found Monty — a sheep whose wool is made of money 🐑 He's the best way to navigate French finance (taxes, Livret A, payslips — all of it). First chat is free:`
      : `Je viens de découvrir Monty — un mouton dont la laine est faite d'argent 🐑 Le meilleur moyen de naviguer les finances françaises. Première conversation gratuite :`;

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(referralUrl || baseUrl)}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${tweetText} ${referralUrl || baseUrl}`)}`;

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-inter">
      {/* Nav */}
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

      <main className="mx-auto max-w-2xl px-6 py-20">
        {/* Hero */}
        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl">🎁</div>
          <h1 className="mb-3 text-4xl font-black text-[#111827]">
            {lang === "en"
              ? "Bring a friend to Monty. Get €5 off every month."
              : "Amène un ami à Monty. Gagne 5€ par mois."}
          </h1>
          <p className="text-lg text-[#6B7280]">
            {lang === "en"
              ? "When a friend you refer subscribes to any paid plan, you earn €5 in credit every month."
              : "Quand un ami que tu as parrainé s'abonne à un plan payant, tu reçois 5€ de crédit chaque mois."}
          </p>
        </div>

        {/* Credit rules */}
        <div className="mb-8 rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🐑</span>
            <span className="font-black text-[#92400E] text-sm">
              {lang === "en"
                ? "How credits work"
                : "Comment fonctionnent les crédits"}
            </span>
          </div>
          <ul className="space-y-2">
            {(lang === "en"
              ? [
                  "€5 credit per referred friend who subscribes to any paid plan",
                  "Max €5 redeemable per month. Unused credits roll over.",
                  "Credits never expire as long as you are subscribed",
                  "Your friend gets free access to basic chat with no credit card required",
                ]
              : [
                  "5€ de crédit par ami parrainé qui s'abonne à un plan payant",
                  "Maximum 5€ utilisable par mois. Les crédits non utilisés se reportent.",
                  "Les crédits n'expirent jamais tant que tu es abonné",
                  "Ton ami bénéficie d'un accès gratuit au chat de base, sans carte requise",
                ]
            ).map((rule, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[#78350F]"
              >
                <span
                  className="font-bold shrink-0 mt-0.5"
                  style={{ color: AMBER }}
                >
                  →
                </span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {userLoading || loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🐑</div>
            <p className="text-sm text-[#6B7280]">{t.loading}</p>
          </div>
        ) : !userData?.user ? (
          /* Not signed in */
          <div className="rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-10 text-center">
            <div className="mb-4 text-5xl">🐑</div>
            <p className="mb-6 font-black text-[#92400E]">
              {t.refer_signin_prompt}
            </p>
            <a
              href="/account/signin"
              className="inline-block rounded-full px-8 py-3 text-sm font-black text-white hover:opacity-90 transition-all"
              style={{ backgroundColor: AMBER }}
            >
              {t.refer_signin_btn}
            </a>
          </div>
        ) : error ? (
          <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-6 text-center text-sm text-red-600">
            {error}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div
              className="mb-6 rounded-2xl border-2 p-6 text-center"
              style={{ borderColor: AMBER, backgroundColor: `${AMBER}12` }}
            >
              <div className="text-5xl font-black" style={{ color: AMBER }}>
                {referralCount}
              </div>
              <div className="mt-1 font-black text-[#111827]">
                {t.refer_count(referralCount)}
              </div>
            </div>

            {/* Referral link */}
            <div className="mb-6 rounded-2xl border-2 border-[#E5E7EB] bg-white p-6">
              <label className="mb-3 block text-xs font-black uppercase tracking-wider text-[#6B7280]">
                {t.refer_your_link}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 overflow-hidden rounded-xl border-2 border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 font-mono text-xs text-[#374151] truncate">
                  {referralUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-black text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: copied ? "#10B981" : AMBER }}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? t.refer_copied : t.refer_copy}
                </button>
              </div>
            </div>

            {/* Share buttons */}
            <div className="mb-10 rounded-2xl border-2 border-[#E5E7EB] bg-white p-6">
              <label className="mb-4 block text-xs font-black uppercase tracking-wider text-[#6B7280]">
                {t.refer_share_title}
              </label>
              <div className="flex flex-wrap gap-3">
                <a
                  href={tweetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border-2 border-[#E5E7EB] px-5 py-3 text-sm font-black text-[#111827] hover:border-[#EF9F27] transition-all"
                >
                  <Twitter size={16} className="text-[#1DA1F2]" />
                  Twitter / X
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border-2 border-[#E5E7EB] px-5 py-3 text-sm font-black text-[#111827] hover:border-[#EF9F27] transition-all"
                >
                  <Send size={16} className="text-[#25D366]" />
                  WhatsApp
                </a>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-xl border-2 border-[#E5E7EB] px-5 py-3 text-sm font-black text-[#111827] hover:border-[#EF9F27] transition-all"
                >
                  <Copy size={16} style={{ color: AMBER }} />
                  {lang === "en" ? "Copy link" : "Copier le lien"}
                </button>
              </div>
            </div>

            {/* How it works */}
            <div className="rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-6">
              <h2 className="mb-5 font-black text-[#92400E]">
                {t.refer_how_title}
              </h2>
              <ol className="space-y-4">
                {[t.refer_how_1, t.refer_how_2, t.refer_how_3].map(
                  (step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                        style={{ backgroundColor: AMBER }}
                      >
                        {i + 1}
                      </div>
                      <span className="text-sm text-[#78350F] leading-relaxed">
                        {step}
                      </span>
                    </li>
                  ),
                )}
              </ol>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
