"use client";

import { useCustomer } from "autumn-js/react";
import { useState } from "react";

// Type definitions for Autumn.js
interface AutumnCustomer {
  customerId: string;
  features: {
    story_generation?: {
      balance: number;
    };
  };
  subscriptions?: Array<{
    productId: string;
  }>;
}

interface ProPlanProps {
  onStoryGenerated?: () => void;
  className?: string;
}

export function ProPlan({ onStoryGenerated, className = "" }: ProPlanProps) {
  const { customer, allowed, refetch, attach } = useCustomer();
  const [isLoading, setIsLoading] = useState(false);

  const handleStoryGeneration = async () => {
    if (allowed({ featureId: "story_generation" })) {
      setIsLoading(true);
      try {
        // Track usage server-side
        await fetch("/api/track-usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featureId: "story_generation" }),
        });
        
        await refetch(); // Refetch customer usage data
        onStoryGenerated?.();
      } catch (error) {
        console.error("Error tracking usage:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("You've reached your story generation limit. Upgrade to Pro for unlimited stories!");
    }
  };

  const handleUpgradeToPro = async () => {
    try {
      await attach({ productId: "pro" });
    } catch (error) {
      console.error("Error upgrading to Pro:", error);
    }
  };

  const getRemainingStories = () => {
    return customer?.features.story_generation?.balance || 0;
  };

  const isPro = (customer as unknown as AutumnCustomer)?.subscriptions?.some((sub: { productId: string }) => sub.productId === "pro");

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {isPro ? "Pro Plan" : "Free Plan"}
        </h3>
        {!isPro && (
          <button
            onClick={handleUpgradeToPro}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
          >
            Upgrade to Pro
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Stories Remaining:</span>
          <span className={`font-semibold ${isPro ? 'text-green-600' : 'text-orange-600'}`}>
            {isPro ? "∞ Unlimited" : `${getRemainingStories()} / 5`}
          </span>
        </div>

        {!isPro && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-orange-700">
                Free plan: 5 stories per month
              </span>
            </div>
          </div>
        )}

        {isPro && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700">
                Pro plan: Unlimited stories
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleStoryGeneration}
          disabled={isLoading || (!isPro && getRemainingStories() <= 0)}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isPro || getRemainingStories() > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? "Generating..." : "Generate Story"}
        </button>

        {!isPro && getRemainingStories() <= 0 && (
          <div className="text-center">
            <p className="text-sm text-red-600 mb-2">
              You've used all your free stories!
            </p>
            <button
              onClick={handleUpgradeToPro}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Upgrade to Pro
            </button>
          </div>
        )}
      </div>

      {customer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div>Customer ID: {(customer as unknown as AutumnCustomer).customerId}</div>
            <div>Plan: {isPro ? "Pro" : "Free"}</div>
            {(customer as unknown as AutumnCustomer).subscriptions && (customer as unknown as AutumnCustomer).subscriptions!.length > 0 && (
              <div>
                Subscriptions: {(customer as unknown as AutumnCustomer).subscriptions!.map((sub: { productId: string }) => sub.productId).join(", ")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 