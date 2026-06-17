"use client";
import { useState, useEffect, useCallback } from "react";
import useUser from "@/utils/useUser";
import { useLanguage } from "@/utils/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  ArrowLeft,
  RefreshCw,
  Target,
  MessageCircle,
} from "lucide-react";

const AMBER = "#EF9F27";

const CATEGORIES_EN = [
  "Food",
  "Rent",
  "Transport",
  "Going out",
  "Savings",
  "Other",
];
const CATEGORIES_FR = [
  "Alimentation",
  "Loyer",
  "Transport",
  "Sorties",
  "Épargne",
  "Autre",
];
const CAT_COLORS = {
  Food: "#F59E0B",
  Alimentation: "#F59E0B",
  Rent: "#6366F1",
  Loyer: "#6366F1",
  Transport: "#10B981",
  Transport_fr: "#10B981",
  "Going out": "#EC4899",
  Sorties: "#EC4899",
  Savings: "#EF9F27",
  Épargne: "#EF9F27",
  Other: "#9CA3AF",
  Autre: "#9CA3AF",
};
const getCatColor = (cat) => CAT_COLORS[cat] || "#9CA3AF";

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function DashboardPage() {
  const { data: userData, isLoading: userLoading } = useUser();
  const { lang, toggleLang } = useLanguage();
  const queryClient = useQueryClient();
  const isFr = lang === "fr";
  const CATEGORIES = isFr ? CATEGORIES_FR : CATEGORIES_EN;

  // Expense form state
  const [expAmt, setExpAmt] = useState("");
  const [expCat, setExpCat] = useState(CATEGORIES[0]);
  const [expLabel, setExpLabel] = useState("");
  const [expDate, setExpDate] = useState(today());
  const [showExpForm, setShowExpForm] = useState(false);

  // Goal form state
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalDate, setGoalDate] = useState("");
  const [goalSaved, setGoalSaved] = useState("");
  const [editingSaved, setEditingSaved] = useState(false);
  const [newSaved, setNewSaved] = useState("");

  // Nudge
  const [nudge, setNudge] = useState(null);
  const [nudgeLoading, setNudgeLoading] = useState(false);

  // Fetch expenses
  const { data: expData, isLoading: expLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/expenses");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!userData?.user,
  });

  // Fetch goal
  const { data: goalData, isLoading: goalLoading } = useQuery({
    queryKey: ["goal"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/goal");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!userData?.user,
  });

  const expenses = expData?.expenses || [];
  const goal = goalData?.goal || null;

  // Add expense
  const addExpense = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/dashboard/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["expenses"]);
      setExpAmt("");
      setExpLabel("");
      setExpDate(today());
      setShowExpForm(false);
    },
  });

  // Delete expense
  const deleteExpense = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/dashboard/expenses?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => queryClient.invalidateQueries(["expenses"]),
  });

  // Save goal
  const saveGoal = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/dashboard/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["goal"]);
      setShowGoalForm(false);
    },
  });

  // Update saved amount
  const updateSaved = useMutation({
    mutationFn: async (saved_amount) => {
      const res = await fetch("/api/dashboard/goal", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saved_amount: parseFloat(saved_amount) }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["goal"]);
      setEditingSaved(false);
    },
  });

  // Generate nudge
  const generateNudge = useCallback(async () => {
    if (!expenses.length && !goal) return;
    setNudgeLoading(true);
    try {
      const res = await fetch("/api/dashboard/nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses, goal, lang }),
      });
      const data = await res.json();
      setNudge(data.nudge || null);
    } catch (_) {}
    setNudgeLoading(false);
  }, [expenses, goal, lang]);

  useEffect(() => {
    if (expenses.length > 0 || goal) generateNudge();
  }, [expData, goalData]);

  // Compute category totals
  const totalSpend = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);
  const byCategory = {};
  for (const e of expenses) {
    byCategory[e.category] =
      (byCategory[e.category] || 0) + parseFloat(e.amount);
  }
  const catEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  // Goal progress
  const goalPercent = goal
    ? Math.min(
        100,
        Math.round(
          (parseFloat(goal.saved_amount) / parseFloat(goal.target_amount)) *
            100,
        ),
      )
    : 0;
  const goalRemaining = goal
    ? Math.max(
        0,
        parseFloat(goal.target_amount) - parseFloat(goal.saved_amount),
      )
    : 0;

  // Days until goal date
  const daysUntil = goal
    ? Math.max(
        0,
        Math.ceil(
          (new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white font-inter">
        <div className="text-center">
          <div className="text-5xl mb-3">🐑</div>
          <p className="text-sm text-[#6B7280]">
            {isFr ? "Chargement..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!userData?.user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAF8] font-inter">
        <div className="text-center max-w-sm p-8 rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE]">
          <div className="text-5xl mb-4">🐑</div>
          <h2 className="font-black text-[#92400E] mb-2">
            {isFr
              ? "Connecte-toi pour accéder au dashboard"
              : "Sign in to access your dashboard"}
          </h2>
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

  const isManages =
    userData?.user?.subscription_tier === "manages" ||
    userData?.user?.is_subscriber;

  if (!isManages) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAF8] font-inter">
        <div className="text-center max-w-sm p-8 rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE]">
          <div className="text-5xl mb-4">🐑</div>
          <h2 className="font-black text-xl text-[#92400E] mb-2">
            {isFr
              ? "Monty Manages est un abonnement à 19€/mois"
              : "Monty Manages is a €19/month plan"}
          </h2>
          <p className="text-sm text-[#78350F] mb-6">
            {isFr
              ? "Accède au dashboard personnel avec suivi des dépenses, objectifs et nudges de Monty."
              : "Get your personal dashboard with spending tracking, goal setting, and Monty's monthly nudge."}
          </p>
          <a
            href="/pricing"
            className="inline-block rounded-full px-6 py-2.5 text-sm font-black text-white"
            style={{ backgroundColor: AMBER }}
          >
            {isFr ? "Voir les abonnements" : "See plans"}
          </a>
        </div>
      </div>
    );
  }

  const monthLabel = new Date().toLocaleString(isFr ? "fr-FR" : "en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-inter">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[#F3F4F6] bg-white px-6 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🐑</span>
            <div>
              <div className="text-sm font-black text-[#111827]">AskMonty</div>
              <div className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">
                Monty Manages
              </div>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="rounded-full border border-[#E5E7EB] px-3 py-1.5 text-xs font-semibold text-[#6B7280] hover:border-[#EF9F27] transition-all"
            >
              {lang === "en" ? "🇫🇷 FR" : "🇬🇧 EN"}
            </button>
            <a
              href="/chat"
              className="rounded-full px-4 py-2 text-xs font-black text-white transition-all hover:opacity-90"
              style={{ backgroundColor: AMBER }}
            >
              {isFr ? "Parler à Monty" : "Ask Monty"}
            </a>
            <a
              href="/account/logout"
              className="text-xs text-[#9CA3AF] hover:text-[#111827]"
            >
              {isFr ? "Déconnexion" : "Sign out"}
            </a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#111827]">
            {isFr ? "Ton tableau de bord" : "Your dashboard"}
          </h1>
          <p className="text-sm text-[#6B7280] mt-1 capitalize">{monthLabel}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT COL: Spending + Goal */}
          <div className="lg:col-span-2 space-y-6">
            {/* ── SPENDING TRACKER ── */}
            <div className="rounded-2xl border-2 border-[#E5E7EB] bg-white p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-black text-[#111827]">
                    {isFr ? "Dépenses du mois" : "This month's spending"}
                  </h2>
                  <p
                    className="text-2xl font-black mt-0.5"
                    style={{ color: AMBER }}
                  >
                    €{totalSpend.toFixed(0)}
                  </p>
                </div>
                <button
                  onClick={() => setShowExpForm(!showExpForm)}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-black text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: AMBER }}
                >
                  <Plus size={15} />
                  {isFr ? "Ajouter" : "Add"}
                </button>
              </div>

              {/* Add expense form */}
              {showExpForm && (
                <div className="mb-5 rounded-xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#6B7280] mb-1">
                        {isFr ? "Montant (€)" : "Amount (€)"}
                      </label>
                      <input
                        type="number"
                        value={expAmt}
                        onChange={(e) => setExpAmt(e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className="w-full rounded-xl border-2 border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#EF9F27] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#6B7280] mb-1">
                        {isFr ? "Date" : "Date"}
                      </label>
                      <input
                        type="date"
                        value={expDate}
                        onChange={(e) => setExpDate(e.target.value)}
                        className="w-full rounded-xl border-2 border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#EF9F27] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#6B7280] mb-1">
                      {isFr ? "Catégorie" : "Category"}
                    </label>
                    <select
                      value={expCat}
                      onChange={(e) => setExpCat(e.target.value)}
                      className="w-full rounded-xl border-2 border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#EF9F27] focus:outline-none bg-white"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#6B7280] mb-1">
                      {isFr ? "Note (optionnel)" : "Note (optional)"}
                    </label>
                    <input
                      type="text"
                      value={expLabel}
                      onChange={(e) => setExpLabel(e.target.value)}
                      placeholder={
                        isFr ? "Ex: Courses Monop'" : "e.g. Grocery run"
                      }
                      className="w-full rounded-xl border-2 border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#EF9F27] focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() =>
                        addExpense.mutate({
                          amount: parseFloat(expAmt),
                          category: expCat,
                          label: expLabel,
                          expense_date: expDate,
                        })
                      }
                      disabled={!expAmt || addExpense.isPending}
                      className="flex-1 rounded-full py-2.5 text-sm font-black text-white disabled:opacity-50 transition-all hover:opacity-90"
                      style={{ backgroundColor: AMBER }}
                    >
                      {addExpense.isPending
                        ? "..."
                        : isFr
                          ? "Enregistrer"
                          : "Save"}
                    </button>
                    <button
                      onClick={() => setShowExpForm(false)}
                      className="rounded-full border-2 border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#6B7280] hover:border-[#EF9F27]"
                    >
                      {isFr ? "Annuler" : "Cancel"}
                    </button>
                  </div>
                </div>
              )}

              {/* Category breakdown */}
              {catEntries.length > 0 ? (
                <div className="space-y-3">
                  {catEntries.map(([cat, amt]) => {
                    const pct = totalSpend > 0 ? (amt / totalSpend) * 100 : 0;
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold text-[#374151]">
                            {cat}
                          </span>
                          <span className="font-black text-[#111827]">
                            €{amt.toFixed(0)}{" "}
                            <span className="text-[#9CA3AF] font-normal">
                              ({pct.toFixed(0)}%)
                            </span>
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: getCatColor(cat),
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-[#9CA3AF] text-sm">
                  {isFr
                    ? "Aucune dépense ce mois-ci. Ajoute ta première dépense."
                    : "No expenses this month yet. Add your first one."}
                </div>
              )}

              {/* Recent transactions */}
              {expenses.length > 0 && (
                <div className="mt-5 space-y-2 border-t border-[#F3F4F6] pt-4">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] mb-3">
                    {isFr ? "Récentes" : "Recent"}
                  </p>
                  {expenses.slice(0, 5).map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: getCatColor(e.category) }}
                        />
                        <span className="text-sm text-[#374151]">
                          {e.label || e.category}
                        </span>
                        <span className="text-xs text-[#9CA3AF]">
                          {e.expense_date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#111827]">
                          €{parseFloat(e.amount).toFixed(0)}
                        </span>
                        <button
                          onClick={() => deleteExpense.mutate(e.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#9CA3AF] hover:text-red-500"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── GOAL TRACKER ── */}
            <div className="rounded-2xl border-2 border-[#E5E7EB] bg-white p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-black text-[#111827] flex items-center gap-2">
                  <Target size={18} style={{ color: AMBER }} />
                  {isFr ? "Objectif d'épargne" : "Savings goal"}
                </h2>
                <button
                  onClick={() => {
                    setShowGoalForm(!showGoalForm);
                    if (goal) {
                      setGoalName(goal.name);
                      setGoalTarget(goal.target_amount);
                      setGoalDate(goal.target_date);
                      setGoalSaved(goal.saved_amount);
                    }
                  }}
                  className="text-xs font-black rounded-full border-2 border-[#E5E7EB] px-3 py-1.5 text-[#6B7280] hover:border-[#EF9F27] hover:text-[#EF9F27] transition-all"
                >
                  {goal
                    ? isFr
                      ? "Modifier"
                      : "Edit"
                    : isFr
                      ? "Définir un objectif"
                      : "Set a goal"}
                </button>
              </div>

              {showGoalForm && (
                <div className="mb-5 rounded-xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-4 space-y-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#6B7280] mb-1">
                      {isFr ? "Nom de l'objectif" : "Goal name"}
                    </label>
                    <input
                      type="text"
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                      placeholder={
                        isFr ? "Ex: Voyage au Japon" : "e.g. Japan trip"
                      }
                      className="w-full rounded-xl border-2 border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#EF9F27] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#6B7280] mb-1">
                        {isFr ? "Objectif (€)" : "Target (€)"}
                      </label>
                      <input
                        type="number"
                        value={goalTarget}
                        onChange={(e) => setGoalTarget(e.target.value)}
                        placeholder="3000"
                        className="w-full rounded-xl border-2 border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#EF9F27] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-[#6B7280] mb-1">
                        {isFr ? "Date cible" : "Target date"}
                      </label>
                      <input
                        type="date"
                        value={goalDate}
                        onChange={(e) => setGoalDate(e.target.value)}
                        className="w-full rounded-xl border-2 border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#EF9F27] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-[#6B7280] mb-1">
                      {isFr ? "Déjà épargné (€)" : "Already saved (€)"}
                    </label>
                    <input
                      type="number"
                      value={goalSaved}
                      onChange={(e) => setGoalSaved(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl border-2 border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#EF9F27] focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        saveGoal.mutate({
                          name: goalName,
                          target_amount: parseFloat(goalTarget),
                          saved_amount: parseFloat(goalSaved || 0),
                          target_date: goalDate,
                        })
                      }
                      disabled={
                        !goalName ||
                        !goalTarget ||
                        !goalDate ||
                        saveGoal.isPending
                      }
                      className="flex-1 rounded-full py-2.5 text-sm font-black text-white disabled:opacity-50"
                      style={{ backgroundColor: AMBER }}
                    >
                      {saveGoal.isPending
                        ? "..."
                        : isFr
                          ? "Enregistrer"
                          : "Save goal"}
                    </button>
                    <button
                      onClick={() => setShowGoalForm(false)}
                      className="rounded-full border-2 border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#6B7280] hover:border-[#EF9F27]"
                    >
                      {isFr ? "Annuler" : "Cancel"}
                    </button>
                  </div>
                </div>
              )}

              {goal ? (
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-black text-[#111827]">
                      {goal.name}
                    </span>
                    <span
                      className="text-2xl font-black"
                      style={{ color: AMBER }}
                    >
                      {goalPercent}%
                    </span>
                  </div>
                  <div className="h-4 rounded-full bg-[#F3F4F6] overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${goalPercent}%`,
                        backgroundColor: AMBER,
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center mb-4">
                    <div className="rounded-xl bg-[#F9FAFB] p-3">
                      <div className="text-xs text-[#9CA3AF]">
                        {isFr ? "Épargné" : "Saved"}
                      </div>
                      <div className="font-black text-[#111827]">
                        €{parseFloat(goal.saved_amount).toFixed(0)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#F9FAFB] p-3">
                      <div className="text-xs text-[#9CA3AF]">
                        {isFr ? "Reste" : "Left"}
                      </div>
                      <div className="font-black" style={{ color: AMBER }}>
                        €{goalRemaining.toFixed(0)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#F9FAFB] p-3">
                      <div className="text-xs text-[#9CA3AF]">
                        {isFr ? "Jours" : "Days"}
                      </div>
                      <div className="font-black text-[#111827]">
                        {daysUntil}
                      </div>
                    </div>
                  </div>

                  {/* Update saved amount */}
                  {editingSaved ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={newSaved}
                        onChange={(e) => setNewSaved(e.target.value)}
                        placeholder={
                          isFr ? "Nouveau montant épargné" : "New saved amount"
                        }
                        className="flex-1 rounded-xl border-2 border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#EF9F27] focus:outline-none"
                      />
                      <button
                        onClick={() => updateSaved.mutate(newSaved)}
                        disabled={!newSaved || updateSaved.isPending}
                        className="rounded-full px-4 py-2 text-sm font-black text-white disabled:opacity-50"
                        style={{ backgroundColor: AMBER }}
                      >
                        {isFr ? "OK" : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingSaved(false)}
                        className="rounded-full border-2 border-[#E5E7EB] px-4 py-2 text-sm text-[#6B7280]"
                      >
                        {isFr ? "Annuler" : "Cancel"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingSaved(true);
                        setNewSaved(goal.saved_amount);
                      }}
                      className="w-full rounded-full border-2 border-[#E5E7EB] py-2.5 text-sm font-black text-[#6B7280] hover:border-[#EF9F27] hover:text-[#EF9F27] transition-all"
                    >
                      {isFr
                        ? "Mettre à jour mon épargne"
                        : "Update my saved amount"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-[#9CA3AF] text-sm">
                  {isFr
                    ? "Aucun objectif défini. Fixe-toi un but."
                    : "No goal set yet. Give yourself something to aim for."}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COL: Monty's nudge */}
          <div className="space-y-6">
            <div className="rounded-2xl border-2 border-[#FDE68A] bg-[#FEF9EE] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black text-[#92400E] flex items-center gap-2">
                  <MessageCircle size={16} />
                  {isFr ? "Le mot de Monty" : "Monty's nudge"}
                </h2>
                <button
                  onClick={generateNudge}
                  disabled={nudgeLoading}
                  className="text-[#92400E] hover:opacity-70 disabled:opacity-40 transition-all"
                >
                  <RefreshCw
                    size={15}
                    className={nudgeLoading ? "animate-spin" : ""}
                  />
                </button>
              </div>
              <div className="text-3xl mb-3">🐑</div>
              {nudgeLoading ? (
                <div className="flex gap-1.5">
                  <span className="dot h-2 w-2 rounded-full bg-[#D97706]"></span>
                  <span className="dot h-2 w-2 rounded-full bg-[#D97706] animation-delay-200"></span>
                  <span className="dot h-2 w-2 rounded-full bg-[#D97706] animation-delay-400"></span>
                </div>
              ) : nudge ? (
                <p className="text-sm text-[#78350F] leading-relaxed">
                  {nudge}
                </p>
              ) : (
                <p className="text-sm text-[#9CA3AF]">
                  {isFr
                    ? "Ajoute des dépenses ou un objectif pour recevoir un conseil personnalisé de Monty."
                    : "Add some expenses or a goal to get a personalised nudge from Monty."}
                </p>
              )}
            </div>

            {/* Quick links */}
            <div className="rounded-2xl border-2 border-[#E5E7EB] bg-white p-5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#9CA3AF]">
                {isFr ? "Liens rapides" : "Quick links"}
              </p>
              {[
                {
                  href: "/chat",
                  label: isFr ? "Parler à Monty" : "Chat with Monty",
                  emoji: "💬",
                },
                {
                  href: "/referral",
                  label: isFr ? "Parrainer un ami" : "Refer a friend",
                  emoji: "🎁",
                },
                {
                  href: "/account/settings",
                  label: isFr ? "Paramètres du compte" : "Account settings",
                  emoji: "⚙️",
                },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2 rounded-xl border-2 border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#374151] hover:border-[#EF9F27] transition-all"
                >
                  <span>{l.emoji}</span>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .dot { animation: bounce 0.9s infinite ease-in-out; }
        .animation-delay-200 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
}
