"use client";
import { createContext, useContext, useState, useEffect } from "react";

export const translations = {
  en: {
    nav_pricing: "Pricing",
    nav_chat: "Ask Monty",
    nav_signin: "Sign in",
    nav_back: "Back",
    nav_signup: "Sign up",
    nav_refer: "Refer a Friend",
    hero_eyebrow: "Your first chat is completely free",
    hero_title_1: "Your money friend,",
    hero_title_2: "finally.",
    hero_sub:
      "Monty is a sheep whose wool is made of money. Your guide to the French financial system. Ask anything. No jargon. No judgment.",
    hero_cta: "Ask Monty something",
    hero_cta2: "How it works",
    features_title: "What can Monty help with?",
    feat1_title: "Your first payslip",
    feat1_desc:
      "Confusing fiche de paie? Monty breaks down every line. Cotisations, net imposable, the works.",
    feat2_title: "Tax returns",
    feat2_desc:
      "First time filing in France? Monty walks you through it like a friend who has done it a hundred times.",
    feat3_title: "Where to save",
    feat3_desc:
      "Livret A, PEA, assurance-vie. Monty explains what is worth it for your situation, without the sales pitch.",
    feat4_title: "Expat life",
    feat4_desc:
      "Moved to France? Monty knows the ropes. Residency rules, tax treaties, and where to start.",
    how_title: "How it works",
    step1_title: "Just ask",
    step1_desc:
      "No sign-up. No forms. Just type your question and Monty responds immediately.",
    step2_title: "Monty remembers",
    step2_desc:
      "Subscribe for 9 euros a month and Monty remembers your full situation every time you come back.",
    step3_title: "Always honest",
    step3_desc:
      "Monty is a knowledgeable friend, not a financial advisor. He will always tell you when to get a pro involved.",
    limitations_title: "What are Monty's limitations?",
    lim1: "Not a licensed financial advisor. Think knowledgeable friend, not professional advice.",
    lim2: "No bank account connection. Monty works from what you tell him.",
    lim3: "French financial system only. Other countries coming soon.",
    pricing_title: "Simple pricing",
    plan_free: "Free",
    plan_premium: "Remembers",
    per_month: "/month",
    free_f1: "Your first conversation, on Monty",
    free_f2: "Ask anything about French finance",
    free_f3: "No sign-up required to start",
    free_cta: "Start chatting",
    premium_badge: "MOST POPULAR",
    prem_f1: "Unlimited conversations",
    prem_f2: "Monty remembers your full situation",
    prem_f3: "Faster, more personalised answers",
    prem_f4: "Priority access to new features",
    prem_cta: "Get Monty Remembers",
    faq_title: "Good questions.",
    faq1_q: "Is the first chat really free?",
    faq1_a: "Genuinely. No card, no sign-up. Just ask.",
    faq2_q: "What exactly does Monty remember?",
    faq2_a:
      "Your income situation, your goals, what products you have asked about. Everything from your previous chats. It makes future conversations way more useful.",
    faq3_q: "Can I cancel anytime?",
    faq3_a:
      "Of course. No tricks, no small print. Cancel from your account whenever.",
    faq4_q: "Is Monty a real financial advisor?",
    faq4_a:
      "Nope. Monty is a sheep, not a CFA. He is a knowledgeable friend who gives you real context, not licensed advice. For big decisions, he will always tell you to get a pro.",
    cta_title: "Go on. Ask Monty something.",
    cta_sub: "First chat is free. No sign-up.",
    cta_btn: "Ask Monty",
    footer_tagline: "Your finance friend for France",
    footer_rights: "2026 AskMonty.",
    footer_legal: "Legal",
    footer_privacy: "Privacy",
    footer_contact: "Contact",
    chat_online: "Online",
    chat_remaining: (n) => `${n} free messages left`,
    chat_logout: "Sign out",
    chat_signin: "Sign in",
    chat_welcome_title: "Hey! I'm Monty 🐑",
    chat_welcome_sub:
      "Ask me anything about French finance. First chat is on me.",
    chat_placeholder: "Ask Monty anything...",
    chat_disclaimer:
      "Monty is a knowledgeable friend, not a licensed financial advisor.",
    chat_upgrade: "Unlock memory for 9 euros a month",
    chat_loading: "Loading...",
    chat_prompt1: "Do I need to declare my Revolut or Wise account?",
    chat_prompt2: "Why is my net so much lower than my gross?",
    chat_prompt3: "Should I open a Livret A or a PEA first?",
    chat_prompt4: "I'm on a VIE contract, do I pay French taxes?",
    chat_prompt5:
      "My company offered me an intéressement plan, is it worth it?",
    pricing_page_title: "Choose your Monty plan 🐑",
    pricing_page_sub:
      "Monty remembers your full financial situation. Every conversation gets smarter.",
    pricing_launch_badge: "LAUNCH OFFER",
    pricing_product: "Monty Remembers",
    prem_detail_f1: "Unlimited conversations",
    prem_detail_f2: "Monty remembers everything across sessions",
    prem_detail_f3: "Personalised answers based on your history",
    prem_detail_f4: "Priority access to new features",
    pricing_subscribe_cta: "Get Monty Remembers",
    pricing_already: "You are already a member! 🐑",
    pricing_secure: "Secure payment via Stripe. Cancel anytime.",
    pricing_how_q: "How does the memory work?",
    pricing_how_a:
      "Monty keeps a record of what you have told him. Your income, your goals, your products. Next time you chat, he already knows your situation.",
    pricing_cancel_q: "Can I cancel?",
    pricing_cancel_a:
      "Absolutely. No commitment, no tricks. Cancel from your account whenever you like.",
    signin_title: "Welcome back 👋",
    signin_sub: "Sign in to your AskMonty account",
    email_label: "Email",
    email_placeholder: "you@example.com",
    password_label: "Password",
    password_placeholder: "••••••••",
    signin_btn: "Sign in",
    signin_no_account: "No account yet?",
    signin_signup_link: "Sign up free",
    signin_error_empty: "Please fill in all fields",
    signin_error_invalid: "Incorrect email or password.",
    signin_error_default: "Something went wrong. Please try again.",
    signup_title: "Join AskMonty 🐑",
    signup_sub: "Create your account and let Monty start remembering",
    signup_btn: "Create my account",
    signup_has_account: "Already have an account?",
    signup_signin_link: "Sign in",
    signup_error_empty: "Please fill in all fields",
    signup_error_default: "Something went wrong during sign up.",
    refer_title: "Refer a Friend 🐑",
    refer_sub: "Know someone navigating French finance? Send them to Monty.",
    refer_your_link: "Your referral link",
    refer_copy: "Copy link",
    refer_copied: "Copied!",
    refer_share_title: "Share via",
    refer_stats_title: "Your referrals",
    refer_count: (n) => `${n} friend${n === 1 ? "" : "s"} referred`,
    refer_how_title: "How it works",
    refer_how_1: "Share your unique link with a friend",
    refer_how_2: "They sign up to AskMonty",
    refer_how_3:
      "Your referral count goes up. Perks for top referrers coming soon.",
    refer_signin_prompt: "Sign in to get your referral link",
    refer_signin_btn: "Sign in",
    loading: "Loading...",
    logout_text: "Signing out...",
  },
  fr: {
    nav_pricing: "Tarifs",
    nav_chat: "Demander à Monty",
    nav_signin: "Connexion",
    nav_back: "Retour",
    nav_signup: "S'inscrire",
    nav_refer: "Parrainer un ami",
    hero_eyebrow: "La première conversation est entièrement gratuite",
    hero_title_1: "Ton ami argent,",
    hero_title_2: "enfin.",
    hero_sub:
      "Monty est un mouton dont la laine est faite d'argent. Ton guide du système financier français. Pose n'importe quelle question. Sans jargon. Sans jugement.",
    hero_cta: "Poser une question à Monty",
    hero_cta2: "Comment ça marche",
    features_title: "Qu'est-ce que Monty peut faire pour toi ?",
    feat1_title: "Ta première fiche de paie",
    feat1_desc:
      "Fiche de paie confuse ? Monty décortique chaque ligne. Cotisations, net imposable, tout.",
    feat2_title: "Déclaration d'impôts",
    feat2_desc:
      "Première déclaration en France ? Monty t'accompagne comme un ami qui l'a fait cent fois.",
    feat3_title: "Où épargner",
    feat3_desc:
      "Livret A, PEA, assurance-vie. Monty explique ce qui vaut le coup pour ta situation, sans discours commercial.",
    feat4_title: "Vie d'expatrié",
    feat4_desc:
      "Installé en France ? Monty connaît les règles. Résidence fiscale, conventions fiscales, par où commencer.",
    how_title: "Comment ça marche",
    step1_title: "Pose simplement ta question",
    step1_desc:
      "Pas d'inscription. Pas de formulaire. Tape ta question et Monty répond immédiatement.",
    step2_title: "Monty se souvient",
    step2_desc:
      "Abonne-toi pour 9 euros par mois et Monty se souviendra de toute ta situation à chaque retour.",
    step3_title: "Toujours honnête",
    step3_desc:
      "Monty est un ami bien informé, pas un conseiller financier. Il te dira toujours quand il faut un pro.",
    limitations_title: "Quelles sont les limites de Monty ?",
    lim1: "Pas de conseiller financier agréé. Pense ami bien informé, pas conseil professionnel.",
    lim2: "Pas de connexion bancaire. Monty travaille avec ce que tu lui dis.",
    lim3: "Système financier français uniquement. D'autres pays arrivent bientôt.",
    pricing_title: "Tarifs simples",
    plan_free: "Gratuit",
    plan_premium: "Remembers",
    per_month: "/mois",
    free_f1: "Ta première conversation, offerte par Monty",
    free_f2: "Pose n'importe quelle question sur les finances françaises",
    free_f3: "Pas d'inscription pour commencer",
    free_cta: "Commencer à discuter",
    premium_badge: "LE PLUS POPULAIRE",
    prem_f1: "Conversations illimitées",
    prem_f2: "Monty se souvient de ta situation complète",
    prem_f3: "Réponses plus rapides et personnalisées",
    prem_f4: "Accès prioritaire aux nouvelles fonctionnalités",
    prem_cta: "Obtenir Monty Remembers",
    faq_title: "Vraies questions.",
    faq1_q: "Dois-je déclarer mon compte Revolut ou Wise aux impôts français ?",
    faq1_a:
      "Oui, si tu es résident fiscal français tu dois déclarer tous tes comptes bancaires étrangers dans ta déclaration annuelle via le formulaire 3916. Revolut et Wise comptent tous les deux. L'amende peut atteindre 1 500 euros par compte non déclaré, alors ça vaut les cinq minutes.",
    faq2_q:
      "Je viens d'avoir ma première fiche de paie. Pourquoi mon net est si inférieur à mon brut ?",
    faq2_a:
      "Environ 22 à 25% de ton salaire brut est prélevé en cotisations sociales avant que tu voies quoi que ce soit. Elles couvrent ton assurance maladie, ta retraite et ton assurance chômage. Ce n'est pas un impôt supplémentaire. C'est le prix du système social français, et il est plutôt généreux quand tu en as besoin.",
    faq3_q: "Dois-je ouvrir un Livret A ou un PEA en premier ?",
    faq3_a:
      "Livret A en premier, toujours. C'est disponible immédiatement, sans risque, et rapporte actuellement 3%. Une fois que tu as un à trois mois de dépenses dessus, commence à penser au PEA pour investir à long terme. Ils servent des objectifs complètement différents.",
    faq4_q: "Je suis en contrat VIE. Est-ce que je paie des impôts français ?",
    faq4_a:
      "Ça dépend d'où tu es basé. Si tu travailles à l'étranger sur un VIE, tu n'es généralement pas résident fiscal français et tu ne paies pas d'impôt sur le revenu en France. Si tu es basé en France sur un VIE, tu es imposable. Les règles ont des nuances donc une vérification rapide avec les RH ou un conseiller fiscal s'impose.",
    faq5_q:
      "Mon entreprise m'a proposé un plan d'intéressement. Ça vaut le coup ?",
    faq5_a:
      "Presque toujours oui. L'intéressement est une participation aux bénéfices en plus de ton salaire. Si tu le places dans un plan d'épargne entreprise (PEE ou PER) dans les 15 jours, il est entièrement exonéré d'impôt. Si tu le prends en cash, tu paies l'impôt sur le revenu dessus. Sauf si tu as besoin de l'argent maintenant, le plan d'épargne est le meilleur choix.",
    cta_title: "Allez. Pose une question à Monty.",
    cta_sub: "Première conversation gratuite. Sans inscription.",
    cta_btn: "Parler à Monty",
    footer_tagline: "Ton ami finance pour la France",
    footer_rights: "2026 AskMonty.",
    footer_legal: "Mentions légales",
    footer_privacy: "Confidentialité",
    footer_contact: "Contact",
    chat_online: "En ligne",
    chat_remaining: (n) => `${n} messages gratuits restants`,
    chat_logout: "Déconnexion",
    chat_signin: "Connexion",
    chat_welcome_title: "Salut ! Je suis Monty 🐑",
    chat_welcome_sub:
      "Pose-moi n'importe quelle question sur les finances françaises. La première conversation, c'est moi qui régale.",
    chat_placeholder: "Demande quelque chose à Monty...",
    chat_disclaimer:
      "Monty est un ami bien informé, pas un conseiller financier agréé.",
    chat_upgrade: "Débloquer la mémoire pour 9 euros par mois",
    chat_loading: "Chargement...",
    chat_prompt1: "C'est quoi un Livret A ?",
    chat_prompt2: "Aide-moi à comprendre ma fiche de paie",
    chat_prompt3: "Devrais-je ouvrir un PEA ?",
    chat_prompt4: "Je viens d'arriver en France, par où commencer ?",
    chat_prompt5:
      "Mon entreprise m'a proposé un intéressement, ça vaut le coup ?",
    pricing_page_title: "Passer à Monty Remembers 🐑",
    pricing_page_sub:
      "Monty se souvient de toute ta situation financière. Chaque conversation devient plus intelligente.",
    pricing_launch_badge: "OFFRE DE LANCEMENT",
    pricing_product: "Monty Remembers",
    prem_detail_f1: "Conversations illimitées",
    prem_detail_f2: "Monty se souvient de tout d'une session à l'autre",
    prem_detail_f3: "Réponses personnalisées basées sur ton historique",
    prem_detail_f4: "Accès prioritaire aux nouvelles fonctionnalités",
    pricing_subscribe_cta: "Obtenir Monty Remembers",
    pricing_already: "Tu es déjà membre ! 🐑",
    pricing_secure:
      "Paiement sécurisé via Stripe. Annulation possible à tout moment.",
    pricing_how_q: "Comment fonctionne la mémoire ?",
    pricing_how_a:
      "Monty conserve un enregistrement de ce que tu lui as dit. Tes revenus, tes objectifs, tes produits. La prochaine fois, il connaît déjà ta situation.",
    pricing_cancel_q: "Je peux annuler ?",
    pricing_cancel_a:
      "Absolument. Pas d'engagement, pas de pièges. Annule depuis ton compte quand tu veux.",
    signin_title: "Bon retour 👋",
    signin_sub: "Connecte-toi à ton compte AskMonty",
    email_label: "Email",
    email_placeholder: "toi@exemple.com",
    password_label: "Mot de passe",
    password_placeholder: "••••••••",
    signin_btn: "Se connecter",
    signin_no_account: "Pas encore de compte ?",
    signin_signup_link: "S'inscrire gratuitement",
    signin_error_empty: "Veuillez remplir tous les champs",
    signin_error_invalid: "Email ou mot de passe incorrect.",
    signin_error_default: "Une erreur est survenue. Veuillez réessayer.",
    signup_title: "Rejoindre AskMonty 🐑",
    signup_sub: "Crée ton compte et laisse Monty commencer à se souvenir",
    signup_btn: "Créer mon compte",
    signup_has_account: "Déjà un compte ?",
    signup_signin_link: "Se connecter",
    signup_error_empty: "Veuillez remplir tous les champs",
    signup_error_default: "Une erreur est survenue lors de l'inscription.",
    refer_title: "Parrainer un ami 🐑",
    refer_sub:
      "Tu connais quelqu'un qui navigue les finances françaises ? Envoie-le chez Monty.",
    refer_your_link: "Ton lien de parrainage",
    refer_copy: "Copier le lien",
    refer_copied: "Copié !",
    refer_share_title: "Partager via",
    refer_stats_title: "Tes parrainages",
    refer_count: (n) =>
      `${n} ami${n > 1 ? "s" : ""} parrainé${n > 1 ? "s" : ""}`,
    refer_how_title: "Comment ça marche",
    refer_how_1: "Partage ton lien unique avec un ami",
    refer_how_2: "Il s'inscrit sur AskMonty",
    refer_how_3:
      "Ton compteur de parrainage augmente. Des avantages pour les meilleurs parrains arrivent bientôt.",
    refer_signin_prompt: "Connecte-toi pour obtenir ton lien de parrainage",
    refer_signin_btn: "Se connecter",
    loading: "Chargement...",
    logout_text: "Déconnexion en cours...",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("askmonty-lang");
      if (saved === "fr" || saved === "en") setLang(saved);
    } catch (_) {}
  }, []);

  const toggleLang = () => {
    const next = lang === "en" ? "fr" : "en";
    setLang(next);
    try {
      localStorage.setItem("askmonty-lang", next);
    } catch (_) {}
  };

  return (
    <LanguageContext.Provider
      value={{ lang, toggleLang, t: translations[lang] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}
