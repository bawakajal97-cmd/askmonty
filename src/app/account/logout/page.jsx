"use client";
import useAuth from "@/utils/useAuth";
import { useLanguage } from "@/utils/LanguageContext";
import { useEffect } from "react";

function MainComponent() {
  const { signOut } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    signOut({ callbackUrl: "/", redirect: true });
  }, [signOut]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#FAFAF8] font-inter">
      <div className="text-4xl mb-3">🐑</div>
      <div className="text-sm text-[#6B7280]">{t.logout_text}</div>
    </div>
  );
}

export default MainComponent;
