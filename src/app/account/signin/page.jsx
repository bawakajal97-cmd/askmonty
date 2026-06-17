"use client";
import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { useLanguage } from "@/utils/LanguageContext";

const AMBER = "#EF9F27";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInWithCredentials } = useAuth();
  const { lang, toggleLang, t } = useLanguage();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!email || !password) {
      setError(t.signin_error_empty);
      setLoading(false);
      return;
    }
    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/chat",
        redirect: true,
      });
    } catch (err) {
      setError(
        err.message === "CredentialsSignin"
          ? t.signin_error_invalid
          : t.signin_error_default,
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#FAFAF8] font-inter p-4">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleLang}
          className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#6B7280] hover:border-[#EF9F27] transition-all"
        >
          {lang === "en" ? "🇫🇷 FR" : "🇬🇧 EN"}
        </button>
      </div>
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border-2 border-[#E5E7EB] bg-white p-8"
      >
        <a href="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="text-3xl">🐑</span>
          <span className="text-xl font-black text-[#111827]">AskMonty</span>
        </a>
        <h1 className="mb-1 text-center text-2xl font-black text-[#111827]">
          {t.signin_title}
        </h1>
        <p className="mb-8 text-center text-sm text-[#6B7280]">
          {t.signin_sub}
        </p>
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#6B7280]">
              {t.email_label}
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.email_placeholder}
              className="w-full rounded-xl border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#EF9F27] focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#6B7280]">
              {t.password_label}
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.password_placeholder}
              className="w-full rounded-xl border-2 border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#EF9F27] focus:outline-none transition-all"
            />
          </div>
          {error && (
            <div className="rounded-xl border-2 border-red-100 bg-red-50 p-3 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3 text-sm font-black text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: AMBER }}
          >
            {loading ? t.loading : t.signin_btn}
          </button>
          <p className="text-center text-xs text-[#6B7280]">
            {t.signin_no_account}{" "}
            <a
              href="/account/signup"
              className="font-black hover:underline"
              style={{ color: AMBER }}
            >
              {t.signin_signup_link}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default MainComponent;
