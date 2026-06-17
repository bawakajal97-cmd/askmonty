"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import useUser from "@/utils/useUser";
import { useLanguage } from "@/utils/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, User, AlertCircle, LogOut } from "lucide-react";

const AMBER = "#EF9F27";

function parseMontyMessage(content) {
  const lines = content.split("\n");
  const optionPattern = /^([A-C])\)\s+(.+)$/;
  const options = [];
  const textLines = [];
  for (const line of lines) {
    const match = line.trim().match(optionPattern);
    if (match) {
      options.push({ key: match[1], text: match[2].trim() });
    } else {
      textLines.push(line);
    }
  }
  return {
    text: textLines.join("\n").trim(),
    options: options.length >= 2 ? options : [],
  };
}

export default function ChatPage() {
  const queryClient = useQueryClient();
  const { data: userData, isLoading: userLoading } = useUser();
  const { lang, toggleLang, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const messagesEndRef = useRef(null);

  const { data: historyData } = useQuery({
    queryKey: ["chat-history", sessionId],
    queryFn: async () => {
      const res = await fetch(`/api/chat?sessionId=${sessionId}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    enabled: !!userData?.user?.is_subscriber,
    onSuccess: (data) => {
      if (data.history && data.history.length > 0) setMessages(data.history);
    },
  });

  const chatMutation = useMutation({
    mutationFn: async (message) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Error");
      return data;
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
      queryClient.invalidateQueries(["user"]);
    },
    onError: () => {},
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatMutation.isPending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const cur = input;
    setInput("");
    chatMutation.mutate(cur);
  };

  const sendMessage = useCallback(
    (text) => {
      if (!text || !text.trim() || chatMutation.isPending) return;
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setInput("");
      chatMutation.mutate(text);
    },
    [chatMutation],
  );

  const isSubscriber = userData?.user?.is_subscriber;
  const remaining = Math.max(
    0,
    100 - (userData?.user?.conversations_count || 0),
  );
  const quickPrompts = [
    t.chat_prompt1,
    t.chat_prompt2,
    t.chat_prompt3,
    t.chat_prompt4,
    t.chat_prompt5,
  ];

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white font-inter">
        <div className="text-center">
          <div className="text-5xl mb-3">🐑</div>
          <p className="text-sm text-[#6B7280]">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white font-inter">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-[#F3F4F6] bg-white px-4 py-3 sm:px-6">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">🐑</span>
          <div>
            <div className="text-base font-black text-[#111827] leading-tight">
              AskMonty
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              <span className="text-[11px] text-[#6B7280]">
                {t.chat_online}
              </span>
            </div>
          </div>
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          {!isSubscriber && userData?.user && (
            <div className="hidden rounded-full border border-[#FDE68A] bg-[#FEF9EE] px-3 py-1 text-xs font-semibold text-[#92400E] sm:block">
              {t.chat_remaining(remaining)}
            </div>
          )}
          <button
            onClick={toggleLang}
            className="rounded-full border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#6B7280] hover:border-[#EF9F27] transition-all"
          >
            {lang === "en" ? "🇫🇷 FR" : "🇬🇧 EN"}
          </button>
          {userData?.user ? (
            <a
              href="/account/logout"
              className="flex items-center gap-1 text-xs font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">{t.chat_logout}</span>
            </a>
          ) : (
            <a
              href="/account/signin"
              className="rounded-full px-4 py-1.5 text-xs font-black text-white transition-all hover:opacity-90"
              style={{ backgroundColor: AMBER }}
            >
              {t.chat_signin}
            </a>
          )}
        </div>
      </header>

      {/* Upgrade banner for logged-in non-subscribers */}
      {userData?.user && !isSubscriber && (
        <div className="shrink-0 border-b border-[#FDE68A] bg-[#FEF9EE] px-4 py-2 text-center text-xs">
          <span className="font-semibold text-[#92400E]">
            {t.chat_remaining(remaining)} ·{" "}
          </span>
          <a
            href="/pricing"
            className="font-black underline"
            style={{ color: AMBER }}
          >
            {t.chat_upgrade}
          </a>
        </div>
      )}

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          {messages.length === 0 && (
            <div className="py-10 text-center">
              <div className="mb-4 text-6xl">🐑</div>
              <h2 className="mb-2 text-2xl font-black text-[#111827]">
                {t.chat_welcome_title}
              </h2>
              <p className="mb-8 mx-auto max-w-sm text-sm text-[#6B7280]">
                {t.chat_welcome_sub}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => setInput(p)}
                    className="rounded-full border-2 border-[#FDE68A] bg-[#FEF9EE] px-4 py-2 text-sm font-semibold text-[#92400E] hover:border-[#EF9F27] transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-5">
            {messages.map((msg, i) => {
              const isLastAssistant =
                msg.role === "assistant" && i === messages.length - 1;
              const parsed =
                msg.role === "assistant"
                  ? parseMontyMessage(msg.content)
                  : null;
              return (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`flex max-w-[85%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className="shrink-0">
                      {msg.role === "assistant" ? (
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-lg"
                          style={{ backgroundColor: `${AMBER}22` }}
                        >
                          🐑
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F6]">
                          <User size={14} className="text-[#6B7280]" />
                        </div>
                      )}
                    </div>
                    <div
                      className="rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                      style={
                        msg.role === "assistant"
                          ? {
                              background: "#F9FAFB",
                              color: "#111827",
                              border: "2px solid #F3F4F6",
                            }
                          : { backgroundColor: AMBER, color: "white" }
                      }
                    >
                      {parsed ? parsed.text : msg.content}
                    </div>
                  </div>
                  {isLastAssistant && parsed && parsed.options.length >= 2 && (
                    <div className="mt-3 ml-11 flex flex-wrap gap-2">
                      {parsed.options.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => sendMessage(opt.text)}
                          disabled={chatMutation.isPending}
                          className="rounded-full border-2 border-[#FDE68A] bg-[#FEF9EE] px-4 py-2 text-sm font-semibold text-[#92400E] hover:border-[#EF9F27] hover:bg-white transition-all disabled:opacity-50"
                        >
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-lg"
                    style={{ backgroundColor: `${AMBER}22` }}
                  >
                    🐑
                  </div>
                  <div className="rounded-2xl border-2 border-[#F3F4F6] bg-[#F9FAFB] px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      <span className="dot h-2 w-2 rounded-full bg-[#D1D5DB]"></span>
                      <span className="dot h-2 w-2 rounded-full bg-[#D1D5DB] animation-delay-200"></span>
                      <span className="dot h-2 w-2 rounded-full bg-[#D1D5DB] animation-delay-400"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {chatMutation.error && (
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-5 text-center">
                <AlertCircle size={20} className="text-[#D97706]" />
                <p className="text-sm font-bold text-[#92400E]">
                  {chatMutation.error.message}
                </p>
                {(chatMutation.error.message.includes("limit") ||
                  chatMutation.error.message.includes("limite")) && (
                  <a
                    href="/pricing"
                    className="rounded-full px-5 py-2 text-xs font-black text-white hover:opacity-90"
                    style={{ backgroundColor: AMBER }}
                  >
                    {t.chat_upgrade}
                  </a>
                )}
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <div className="shrink-0 border-t border-[#F3F4F6] bg-white px-4 py-4 sm:px-6">
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chat_placeholder}
            disabled={chatMutation.isPending}
            className="flex-1 rounded-full border-2 border-[#E5E7EB] bg-[#FAFAFA] px-5 py-3 text-sm focus:outline-none focus:border-[#EF9F27] disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={chatMutation.isPending || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-all hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: AMBER }}
          >
            <Send size={16} />
          </button>
        </form>
        <p className="mt-2 text-center text-[10px] text-[#9CA3AF]">
          {t.chat_disclaimer}
        </p>
      </div>

      <style jsx global>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .dot { animation: bounce 0.9s infinite ease-in-out; }
        .animation-delay-200 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
}
