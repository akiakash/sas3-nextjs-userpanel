"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getPortalSummary, type PortalSummary } from "@/lib/portal-api";

const EMPTY: PortalSummary = {
  orders: 0,
  bids: 0,
  negotiations: 0,
  wishlist: 0,
};

export function usePortalSummary() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<PortalSummary>(EMPTY);

  const refresh = useCallback(async () => {
    if (!token) {
      setSummary(EMPTY);
      return;
    }
    try {
      setSummary(await getPortalSummary());
    } catch {
      setSummary(EMPTY);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { summary, refresh };
}
