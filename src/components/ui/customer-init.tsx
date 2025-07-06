"use client";

import { useEffect } from "react";
import { getCustomerId, setCustomerIdCookie } from "@/lib/autumn-client";

export function CustomerInit() {
  useEffect(() => {
    // Ensure customer ID is initialized
    const customerId = getCustomerId();
    console.log("Customer ID initialized:", customerId);
    
    // Store in localStorage for consistency
    localStorage.setItem("autumn-customer-id", customerId);
    
    // Set as cookie for server-side access
    setCustomerIdCookie();
  }, []);

  return null;
} 