"use client";

import { useEffect, useState } from "react";
import { getCustomerId } from "@/lib/autumn-client";

export function CustomerDebug() {
  const [customerId, setCustomerId] = useState<string>("");

  useEffect(() => {
    setCustomerId(getCustomerId());
  }, []);

  if (!customerId) return null; // Don't render until client-side

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div>Customer ID: {customerId}</div>
    </div>
  );
} 