import { autumnHandler } from "autumn-js/next";

export const { GET, POST } = autumnHandler({
  identify: async (request) => {
    console.log("=== Autumn API Request ===");
    console.log("Request URL:", request.url);
    console.log("Request method:", request.method);
    console.log("Headers:", Object.fromEntries(request.headers.entries()));
    
    // Try to get customer ID from multiple sources
    let customerId = request.headers.get("x-autumn-customer-id") || 
                    request.headers.get("authorization")?.replace("Bearer ", "") ||
                    request.cookies.get("autumn-customer-id")?.value;
    
    console.log("Found customer ID:", customerId);
    
    // If no customer ID exists, create a new one
    if (!customerId) {
      customerId = "user-" + Math.random().toString(36).substr(2, 9);
      console.log("Created new customer ID:", customerId);
    } else {
      console.log("Using existing customer ID:", customerId);
    }

    const result = {
      customerId: customerId,
      customerData: {
        name: "Story User",
        email: "user@example.com",
      },
    };
    
    console.log("Returning customer data:", result);
    console.log("=== End Autumn API Request ===");
    
    return result;
  },
}); 