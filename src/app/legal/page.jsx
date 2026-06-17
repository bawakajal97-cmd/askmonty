"use client";
import { useLanguage } from "@/utils/LanguageContext";
import { ArrowLeft } from "lucide-react";

const AMBER = "#EF9F27";

export default function LegalPage() {
  const { lang, toggleLang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* Nav */}
      <nav className="border-b border-[#F3F4F6] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
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

      <main className="mx-auto max-w-2xl px-6 py-20">
        <div className="mb-10">
          <div className="mb-4 text-4xl">⚖️</div>
          <h1 className="text-4xl font-black text-[#111827] mb-3">
            {isFr ? "Mentions légales" : "Legal Disclaimer"}
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            {isFr
              ? "Dernière mise à jour : mai 2026"
              : "Last updated: May 2026"}
          </p>
        </div>

        {/* The key disclaimer paragraph */}
        <div className="mb-10 rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🐑</span>
            <h2 className="text-xl font-black text-[#92400E]">
              {isFr
                ? "Monty n'est pas un conseiller financier"
                : "Monty is not a financial advisor"}
            </h2>
          </div>
          <p className="text-sm text-[#78350F] leading-relaxed">
            {isFr
              ? "AskMonty et son personnage Monty fournissent des informations à caractère général et éducatif sur le système financier français. Ces informations sont destinées à des fins informatives uniquement et ne constituent en aucun cas des conseils financiers, fiscaux, juridiques ou d'investissement personnalisés. Monty n'est pas un conseiller en investissements financiers (CIF), un notaire, un expert-comptable ou tout autre professionnel réglementé. Pour toute décision financière importante, vous devez consulter un professionnel qualifié et agréé."
              : "AskMonty and its character Monty provide general, educational information about the French financial system. This information is intended for informational purposes only and does not constitute personalised financial, tax, legal or investment advice. Monty is not a licensed financial advisor, notaire, accountant, or any other regulated professional. For any major financial decision, you should consult a qualified and licensed professional."}
          </p>
        </div>

        <div className="space-y-8 text-[#374151] leading-relaxed">
          <section>
            <h2 className="text-xl font-black text-[#111827] mb-3">
              {isFr ? "Éditeur du service" : "Service publisher"}
            </h2>
            <p className="text-sm">
              {isFr
                ? "AskMonty est un service en ligne. Pour toute question, contactez-nous à hello@askmonty.com."
                : "AskMonty is an online service. For any questions, contact us at hello@askmonty.com."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827] mb-3">
              {isFr ? "Exactitude des informations" : "Accuracy of information"}
            </h2>
            <p className="text-sm">
              {isFr
                ? "Bien que Monty s'efforce de fournir des informations précises et à jour sur le système financier français, ces informations peuvent évoluer. La réglementation fiscale et financière change régulièrement. AskMonty ne saurait être tenu responsable des erreurs, omissions ou inexactitudes dans les informations fournies."
                : "While Monty strives to provide accurate and up-to-date information about the French financial system, this information may change. Tax and financial regulations are updated regularly. AskMonty cannot be held liable for errors, omissions or inaccuracies in the information provided."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827] mb-3">
              {isFr
                ? "Limitation de responsabilité"
                : "Limitation of liability"}
            </h2>
            <p className="text-sm">
              {isFr
                ? "AskMonty ne saurait être tenu responsable de toute décision prise sur la base des informations fournies par Monty. L'utilisation du service se fait sous la seule responsabilité de l'utilisateur. En cas de doute ou pour toute décision financière significative, consultez un professionnel agréé."
                : "AskMonty cannot be held liable for any decision made on the basis of information provided by Monty. Use of the service is the sole responsibility of the user. When in doubt or for any significant financial decision, please consult a licensed professional."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827] mb-3">
              {isFr
                ? "RGPD et conservation des données"
                : "GDPR and data retention"}
            </h2>
            <p className="text-sm">
              {isFr
                ? "Ce service est soumis au RGPD. Les utilisateurs basés en France ont le droit d'accéder à leurs données personnelles, de les corriger, de les supprimer et de s'opposer à leur traitement. Les données sont conservées 30 jours après la fin d'un abonnement, puis définitivement supprimées. Les utilisateurs peuvent exporter leurs données en CSV ou demander la suppression immédiate à tout moment en contactant hello@askmonty.com."
                : "This product operates under GDPR. Users based in France have the right to access, correct, and delete their personal data. Data is retained for 30 days after unsubscription before permanent deletion. Users can export their data as a CSV or request immediate deletion at any time by contacting hello@askmonty.com."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827] mb-3">
              {isFr ? "Propriété intellectuelle" : "Intellectual property"}
            </h2>
            <p className="text-sm">
              {isFr
                ? "Le nom AskMonty, le personnage Monty et l'ensemble du contenu du service sont la propriété d'AskMonty. Toute reproduction ou utilisation sans autorisation est interdite."
                : "The name AskMonty, the character Monty and all content on the service are the property of AskMonty. Any reproduction or use without permission is prohibited."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827] mb-3">
              {isFr ? "Droit applicable" : "Applicable law"}
            </h2>
            <p className="text-sm">
              {isFr
                ? "Les présentes mentions légales sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents."
                : "These legal terms are governed by French law. Any dispute shall be submitted to the competent courts."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#111827] mb-3">
              {isFr ? "Contact" : "Contact"}
            </h2>
            <p className="text-sm">
              {isFr
                ? "Pour toute question légale : "
                : "For any legal questions: "}
              <span className="font-semibold" style={{ color: AMBER }}>
                hello@askmonty.com
              </span>
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-[#E5E7EB] bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-lg">🐑</span>
            <span className="text-sm font-black text-[#111827]">AskMonty</span>
          </a>
          <div className="flex gap-6">
            <a href="/legal" className="text-xs text-[#111827] font-semibold">
              {isFr ? "Mentions légales" : "Legal"}
            </a>
            <a
              href="/privacy"
              className="text-xs text-[#9CA3AF] hover:text-[#111827] transition-colors"
            >
              {isFr ? "Confidentialité" : "Privacy"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
