"use client";

import { useCustomer } from "autumn-js/react";
import { useState, useEffect } from "react";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProUpgradeModal({ isOpen, onClose }: ProUpgradeModalProps) {
  const { customer, allowed, refetch, attach } = useCustomer();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user became Pro and grant credits
  useEffect(() => {
    const checkAndGrantCredits = async () => {
      console.log("Checking customer status:", customer);
      console.log("Customer subscriptions:", customer && (customer as any).subscriptions);
      
      if (customer && (customer as any).subscriptions?.some((sub: any) => sub.productId === "pro")) {
        console.log("User is Pro, checking if credits need to be granted...");
        // User is Pro, grant credits if not already granted
        const hasBeenGranted = localStorage.getItem("proCreditsGranted");
        
        if (!hasBeenGranted) {
          console.log("User became Pro, granting credits...");
          // Reset usage count to 0 (fresh start with Pro)
          localStorage.setItem("storyUsageCount", "0");
          localStorage.setItem("proCreditsGranted", "true");
          
          console.log("Granted Pro status - usage count reset to 0");
        } else {
          console.log("Credits already granted for this Pro user");
        }
      } else {
        console.log("User is not Pro yet");
      }
    };

    checkAndGrantCredits();
  }, [customer]);

  const handleUpgradeToPro = async () => {
    setIsLoading(true);
    try {
      console.log("Starting upgrade process...");
      console.log("Current customer:", customer);
      
      // Check if user is already Pro
      const isAlreadyPro = customer && (customer as any).subscriptions?.some((sub: any) => sub.productId === "pro");
      console.log("Is already Pro:", isAlreadyPro);
      
      if (!isAlreadyPro) {
        console.log("User is not Pro, attempting to attach...");
        try {
          // Use Autumn's attach function to handle the purchase flow
          await attach({ productId: "pro" });
          
          // After successful attachment, grant Pro benefits
          localStorage.setItem("storyUsageCount", "0");
          localStorage.setItem("proCreditsGranted", "true");
          
          console.log("Successfully upgraded to Pro - usage count reset to 0");
          
        } catch (attachError: any) {
          console.log("Attach error:", attachError);
          // If attachment fails due to already being attached, that's okay
          if (attachError?.message?.includes("already attached") || attachError?.message?.includes("Product Pro is already attached")) {
            console.log("Product already attached, granting Pro benefits anyway");
            
            // Grant Pro benefits even if already attached
            localStorage.setItem("storyUsageCount", "0");
            localStorage.setItem("proCreditsGranted", "true");
            
            // Don't show this as an error to the user
            console.log("Pro benefits granted successfully");
          } else {
            throw attachError; // Re-throw other errors
          }
        }
      } else {
        console.log("User is already Pro, granting additional benefits...");
        // User is already Pro, just grant additional benefits
        localStorage.setItem("storyUsageCount", "0");
        localStorage.setItem("proCreditsGranted", "true");
      }
      
      onClose();
    } catch (error) {
      console.error("Error upgrading to Pro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isPro = customer && (customer as any).subscriptions?.some((sub: any) => sub.productId === "pro");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Upgrade to Pro</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {isPro ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">You're Already Pro!</h3>
              <p className="text-gray-600 mb-6">
                You have unlimited access to story generation and all Pro features.
              </p>
              <button
                onClick={handleUpgradeToPro}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Refreshing...
                  </div>
                ) : (
                  "Refresh Pro Status"
                )}
              </button>
              
              {/* Debug button - remove in production */}
              <button
                onClick={() => {
                  localStorage.setItem("storyUsageCount", "0");
                  localStorage.setItem("proCreditsGranted", "true");
                  
                  console.log("Manually reset usage count to 0 for Pro user");
                  onClose();
                }}
                className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors"
              >
                Debug: Reset Usage Count
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Unlimited Stories</h4>
                    <p className="text-sm text-gray-600">Generate unlimited stories without restrictions</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Advanced Features</h4>
                    <p className="text-sm text-gray-600">Enhanced story generation and customization</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Priority Support</h4>
                    <p className="text-sm text-gray-600">Get help when you need it most</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">20 Stories per Month</h4>
                    <p className="text-sm text-gray-600">Get 20 stories per month instead of just 5</p>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">₹10</div>
                <div className="text-sm text-gray-600">per month</div>
                <div className="text-xs text-gray-500 mt-1">Billed monthly • Cancel anytime</div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleUpgradeToPro}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    "Upgrade to Pro"
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Maybe Later
                </button>
              </div>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  Cancel anytime. No commitment required.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 