"use client";
import { useState } from "react";
import useUser from "@/utils/useUser";
import { useLanguage } from "@/utils/LanguageContext";
import {
  ArrowLeft,
  Download,
  LogOut,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const AMBER = "#EF9F27";

export default function SettingsPage() {
  const { data: userData, isLoading, refetch } = useUser();
  const { lang, toggleLang } = useLanguage();
  const isFr = lang === "fr";
  const [exporting, setExporting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelledDate, setCancelledDate] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/account/export?format=csv");
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `askmonty-export-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(
        isFr
          ? "L'export a échoué. Réessaie."
          : "Export failed. Please try again.",
      );
    } finally {
      setExporting(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    setCancelError(null);
    try {
      const res = await fetch("/api/stripe-cancel-subscription", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Cancel failed");
      const data = await res.json();
      setCancelledDate(data.cancelDate);
      setShowCancelConfirm(false);
      if (refetch) refetch();
    } catch (err) {
      console.error(err);
      setCancelError(
        isFr
          ? "Quelque chose a mal tourné. Réessaie."
          : "Something went wrong. Please try again.",
      );
    } finally {
      setCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAF8] font-inter">
        <div className="text-5xl">🐑</div>
      </div>
    );
  }

  if (!userData?.user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAF8] font-inter">
        <div className="text-center">
          <div className="text-5xl mb-4">🐑</div>
          <p className="font-black text-[#92400E]">
            {isFr
              ? "Connecte-toi pour accéder aux paramètres."
              : "Sign in to access settings."}
          </p>
          <a
            href="/account/signin"
            className="inline-block mt-4 rounded-full px-6 py-2.5 text-sm font-black text-white"
            style={{ backgroundColor: AMBER }}
          >
            {isFr ? "Se connecter" : "Sign in"}
          </a>
        </div>
      </div>
    );
  }

  const user = userData.user;
  const isSubscribed =
    user.subscription_tier === "remembers" ||
    user.subscription_tier === "manages" ||
    user.is_subscriber;

  const tierLabel =
    user.subscription_tier === "manages"
      ? "Monty Manages"
      : user.subscription_tier === "remembers" || user.is_subscriber
        ? "Monty Remembers"
        : isFr
          ? "Gratuit"
          : "Free";

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-inter">
      {/* Nav */}
      <nav className="border-b border-[#F3F4F6] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827]"
          >
            <ArrowLeft size={16} /> {isFr ? "Retour" : "Back"}
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

      <main className="mx-auto max-w-2xl px-6 py-16 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-[#111827] mb-1">
            {isFr ? "Paramètres du compte" : "Account settings"}
          </h1>
          <p className="text-sm text-[#9CA3AF]">{user.email}</p>
        </div>

        {/* Subscription status */}
        <div className="rounded-2xl border-2 border-[#E5E7EB] bg-white p-6">
          <h2 className="font-black text-[#111827] mb-3">
            {isFr ? "Abonnement" : "Subscription"}
          </h2>

          {cancelledDate ? (
            <div className="rounded-xl bg-[#FEF9EE] border border-[#FDE68A] p-4 text-sm text-[#92400E]">
              <div className="font-black mb-1">
                {isFr ? "Annulation confirmée" : "Cancellation confirmed"}
              </div>
              <p>
                {isFr
                  ? `Tu garderas accès jusqu'au ${cancelledDate}. Après cette date, ton compte repassera en gratuit.`
                  : `You'll keep access until ${cancelledDate}. After that, your account reverts to free.`}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#374151]">
                    {tierLabel}
                  </div>
                  {isSubscribed && (
                    <div className="text-xs text-[#9CA3AF] mt-0.5">
                      {isFr ? "Annulable à tout moment" : "Cancel anytime"}
                    </div>
                  )}
                </div>
                {!isSubscribed && (
                  <a
                    href="/pricing"
                    className="rounded-full px-4 py-2 text-xs font-black text-white"
                    style={{ backgroundColor: AMBER }}
                  >
                    {isFr ? "Passer à Remembers" : "Upgrade"}
                  </a>
                )}
              </div>

              {isSubscribed && !showCancelConfirm && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] hover:text-red-500 transition-colors"
                >
                  <XCircle size={13} />
                  {isFr ? "Annuler mon abonnement" : "Cancel my subscription"}
                </button>
              )}

              {isSubscribed && showCancelConfirm && (
                <div className="mt-4 rounded-xl border-2 border-red-100 bg-red-50 p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle
                      size={16}
                      className="text-red-500 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-black text-red-700">
                        {isFr ? "Tu es sûr(e) ?" : "Are you sure?"}
                      </p>
                      <p className="text-xs text-red-500 mt-0.5 leading-relaxed">
                        {isFr
                          ? "Tu garderas l'accès jusqu'à la fin de ta période en cours. Aucun remboursement n'est émis pour les jours restants."
                          : "You'll keep access until the end of your current billing period. No refund is issued for remaining days."}
                      </p>
                      {cancelError && (
                        <p className="text-xs text-red-600 mt-1 font-semibold">
                          {cancelError}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="rounded-full bg-red-500 px-4 py-2 text-xs font-black text-white hover:bg-red-600 transition-colors disabled:opacity-60"
                    >
                      {cancelling
                        ? isFr
                          ? "Annulation..."
                          : "Cancelling..."
                        : isFr
                          ? "Oui, annuler"
                          : "Yes, cancel"}
                    </button>
                    <button
                      onClick={() => {
                        setShowCancelConfirm(false);
                        setCancelError(null);
                      }}
                      disabled={cancelling}
                      className="rounded-full border-2 border-red-200 px-4 py-2 text-xs font-black text-red-500 hover:border-red-400 transition-colors disabled:opacity-60"
                    >
                      {isFr ? "Garder mon abonnement" : "Keep my plan"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Export data */}
        <div className="rounded-2xl border-2 border-[#E5E7EB] bg-white p-6">
          <h2 className="font-black text-[#111827] mb-1">
            {isFr ? "Exporter mes données" : "Export my data"}
          </h2>
          <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
            {isFr
              ? "Télécharge toutes tes données : dépenses, objectifs et historique de conversation au format CSV."
              : "Download all your data: expenses, goals and conversation history as a CSV file."}
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 rounded-full border-2 border-[#E5E7EB] px-5 py-2.5 text-sm font-black text-[#374151] hover:border-[#EF9F27] hover:text-[#EF9F27] transition-all disabled:opacity-50"
          >
            <Download size={15} />
            {exporting
              ? isFr
                ? "Export en cours..."
                : "Exporting..."
              : isFr
                ? "Exporter mes données (CSV)"
                : "Export my data (CSV)"}
          </button>
        </div>

        {/* Data retention note */}
        <div className="rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🐑</span>
            <span className="font-black text-[#92400E] text-sm">
              {isFr ? "Tes données" : "Your data"}
            </span>
          </div>
          <p className="text-sm text-[#78350F] leading-relaxed">
            {isFr
              ? "Si tu te désabonnes, tes données sont conservées 30 jours pour que tu puisses reprendre là où tu en étais. Après 30 jours, elles sont définitivement supprimées. Pour demander une suppression immédiate, écris-nous à hello@askmonty.com."
              : "If you unsubscribe, your data is kept for 30 days in case you resubscribe and want to pick up where you left off. After 30 days it is permanently deleted. To request immediate deletion, email us at hello@askmonty.com."}
          </p>
        </div>

        {/* Sign out */}
        <div className="rounded-2xl border-2 border-[#E5E7EB] bg-white p-6">
          <h2 className="font-black text-[#111827] mb-3">
            {isFr ? "Session" : "Session"}
          </h2>
          <a
            href="/account/logout"
            className="flex items-center gap-2 text-sm font-black text-[#6B7280] hover:text-[#111827] transition-colors"
          >
            <LogOut size={15} />
            {isFr ? "Se déconnecter" : "Sign out"}
          </a>
        </div>

        <div className="flex gap-4 pt-2">
          <a
            href="/privacy"
            className="text-xs text-[#9CA3AF] hover:text-[#111827]"
          >
            {isFr ? "Confidentialité" : "Privacy"}
          </a>
          <a
            href="/legal"
            className="text-xs text-[#9CA3AF] hover:text-[#111827]"
          >
            {isFr ? "Mentions légales" : "Legal"}
          </a>
        </div>
      </main>
    </div>
  );
}
