import { useCallback, useEffect } from "react";
import { create } from "zustand";

const useSubscriptionStore = create((set, get) => ({
  isSubscribed: false,
  loading: true,
  checkSubscription: async () => {
    try {
      const response = await fetch("/api/get-subscription-status", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to check subscription");
      const data = await response.json();
      set({ isSubscribed: data.status === "active", loading: false });
    } catch (error) {
      console.error("Error checking subscription:", error);
      set({ loading: false });
    }
  },
}));

export function useSubscription() {
  const { isSubscribed, loading, checkSubscription } = useSubscriptionStore();

  const initiateSubscription = useCallback(async () => {
    try {
      const response = await fetch("/api/stripe-checkout-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirectURL: window.location.href }),
      });

      if (!response.ok) throw new Error("Failed to get checkout link");

      const { url } = await response.json();
      if (url) {
        window.open(url, "_blank", "popup");
        // Poll for status after popup closes or user returns
        const checkInterval = setInterval(() => {
          checkSubscription();
        }, 3000);
        setTimeout(() => clearInterval(checkInterval), 30000); // Poll for 30s
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }
  }, [checkSubscription]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    isSubscribed,
    loading,
    initiateSubscription,
  };
}

export default useSubscription;
