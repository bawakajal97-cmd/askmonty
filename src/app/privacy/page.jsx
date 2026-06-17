"use client";
import { useLanguage } from "@/utils/LanguageContext";
import { ArrowLeft } from "lucide-react";

const AMBER = "#EF9F27";

export default function PrivacyPage() {
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
          <div className="mb-4 text-4xl">🔒</div>
          <h1 className="text-4xl font-black text-[#111827] mb-3">
            {isFr ? "Politique de confidentialité" : "Privacy Policy"}
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            {isFr
              ? "Dernière mise à jour : mai 2026"
              : "Last updated: May 2026"}
          </p>
        </div>

        {isFr ? (
          <div className="space-y-8 text-[#374151] leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                Qui sommes-nous
              </h2>
              <p className="text-sm">
                AskMonty est un service d'information financière pour les
                personnes naviguant le système financier français. Monty n'est
                pas un conseiller financier agréé. Il fournit des informations
                générales et éducatives, pas des conseils financiers
                personnalisés.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                Ce que nous collectons
              </h2>
              <p className="text-sm mb-3">
                Nous collectons uniquement les informations que tu fournis
                toi-même dans la conversation et dans le tableau de bord :
              </p>
              <ul className="text-sm space-y-2 pl-4">
                <li>Adresse email et mot de passe si tu crées un compte.</li>
                <li>
                  Historique de conversation pour les abonnés Premium et Monty
                  Manages, afin que Monty puisse se souvenir de ta situation.
                </li>
                <li>
                  Données de dépenses et objectifs d'épargne saisis dans le
                  tableau de bord Monty Manages.
                </li>
                <li>
                  Statut d'abonnement traité via Stripe. Nous ne stockons jamais
                  les données de ta carte bancaire.
                </li>
                <li>
                  Compteur de conversations pour les utilisateurs gratuits.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                Ce que nous ne faisons pas
              </h2>
              <ul className="text-sm space-y-2 pl-4">
                <li>Nous ne vendons jamais tes données à des tiers.</li>
                <li>
                  Nous ne partageons pas tes conversations avec des tiers.
                </li>
                <li>
                  Nous n'utilisons pas tes données à des fins publicitaires.
                </li>
                <li>
                  Nous ne stockons pas d'informations financières sensibles que
                  tu partages dans le chat.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                Paiements
              </h2>
              <p className="text-sm">
                Les paiements sont traités par Stripe, un prestataire de
                paiement certifié. Nous ne voyons ni ne stockons jamais les
                données de ta carte bancaire.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                Conservation des données
              </h2>
              <p className="text-sm">
                Tes données sont stockées de manière sécurisée. Si tu te
                désabonnes, tes données sont conservées pendant 30 jours pour
                que tu puisses reprendre là où tu en étais si tu te réabonnes.
                Après 30 jours, elles sont définitivement et irrémédiablement
                supprimées. Si tu n'as pas de compte, les conversations de
                session ne sont pas conservées après la fin de la session.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                Export et suppression de données
              </h2>
              <p className="text-sm">
                Tu peux exporter toutes tes données à tout moment depuis les
                paramètres de ton compte au format CSV. Tu peux également
                demander la suppression immédiate de toutes tes données à tout
                moment en nous contactant à hello@askmonty.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                RGPD et tes droits
              </h2>
              <p className="text-sm">
                Ce service est soumis au RGPD. Les utilisateurs basés en France
                ont le droit d'accéder à leurs données personnelles, de les
                corriger, de les supprimer et de s'opposer à leur traitement.
                Pour exercer ces droits, contacte-nous à hello@askmonty.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                Contact
              </h2>
              <p className="text-sm">
                Des questions sur cette politique ? Écris-nous à{" "}
                <span className="font-semibold" style={{ color: AMBER }}>
                  hello@askmonty.com
                </span>
              </p>
            </section>

            <div className="rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🐑</span>
                <span className="font-black text-[#92400E]">
                  Note importante
                </span>
              </div>
              <p className="text-sm text-[#78350F]">
                Monty n'est pas un conseiller financier agréé. Toutes les
                informations fournies par Monty sont à titre éducatif et
                informatif uniquement. Pour toute décision financière
                importante, consulte un professionnel qualifié.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8 text-[#374151] leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                Who we are
              </h2>
              <p className="text-sm">
                AskMonty is a financial information service for people
                navigating the French financial system. Monty is not a licensed
                financial advisor. He provides general, educational information,
                not personalised financial advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                What we collect
              </h2>
              <p className="text-sm mb-3">
                We only collect the information you provide directly in
                conversation and in the dashboard:
              </p>
              <ul className="text-sm space-y-2 pl-4">
                <li>Email address and password if you create an account.</li>
                <li>
                  Conversation history for Premium and Monty Manages
                  subscribers, so Monty can remember your situation.
                </li>
                <li>
                  Expense and savings goal data entered in the Monty Manages
                  dashboard.
                </li>
                <li>
                  Subscription status processed via Stripe. We never store your
                  card details.
                </li>
                <li>Conversation count for free users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                What we do not do
              </h2>
              <ul className="text-sm space-y-2 pl-4">
                <li>We never sell your data to third parties.</li>
                <li>
                  We do not share your conversations with any third party.
                </li>
                <li>We do not use your data for advertising purposes.</li>
                <li>
                  We do not store sensitive financial information you share in
                  chat.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                Payments
              </h2>
              <p className="text-sm">
                Payments are processed by Stripe, a certified payment provider.
                We never see or store your card details.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                Data retention
              </h2>
              <p className="text-sm">
                Your data is stored securely. If you unsubscribe, your data is
                retained for 30 days in case you resubscribe and want to pick up
                where you left off. After 30 days it is permanently and
                irreversibly deleted. If you have no account, session
                conversations are not retained after the session ends.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                Data export and deletion
              </h2>
              <p className="text-sm">
                You can export all your data at any time from your account
                settings as a CSV file. You can also request immediate deletion
                of all your data at any time by contacting us at
                hello@askmonty.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                GDPR and your rights
              </h2>
              <p className="text-sm">
                This service operates under GDPR. Users based in France have the
                right to access, correct, delete, and object to the processing
                of their personal data. To exercise these rights, contact us at
                hello@askmonty.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-[#111827] mb-3">
                Contact
              </h2>
              <p className="text-sm">
                Questions about this policy? Write to us at{" "}
                <span className="font-semibold" style={{ color: AMBER }}>
                  hello@askmonty.com
                </span>
              </p>
            </section>

            <div className="rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🐑</span>
                <span className="font-black text-[#92400E]">
                  Important note
                </span>
              </div>
              <p className="text-sm text-[#78350F]">
                Monty is not a licensed financial advisor. All information
                provided by Monty is for educational and informational purposes
                only. For any major financial decision, please consult a
                qualified professional.
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-[#E5E7EB] bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-lg">🐑</span>
            <span className="text-sm font-black text-[#111827]">AskMonty</span>
          </a>
          <div className="flex gap-6">
            <a
              href="/legal"
              className="text-xs text-[#9CA3AF] hover:text-[#111827] transition-colors"
            >
              {isFr ? "Mentions légales" : "Legal"}
            </a>
            <a href="/privacy" className="text-xs text-[#111827] font-semibold">
              {isFr ? "Confidentialité" : "Privacy"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
