import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Autumn webhook received:", body);

    // Check if this is a successful payment event
    if (body.event === "subscription.created" || body.event === "payment.succeeded") {
      const customerId = body.data?.customerId;
      
      if (customerId) {
        console.log(`Granting credits to customer: ${customerId}`);
        
        // Get current usage from localStorage (this would need to be stored server-side in production)
        // For now, we'll grant 100 credits regardless
        const additionalCredits = 100;
        
        // In a real implementation, you would:
        // 1. Store credits in a database associated with the customer ID
        // 2. Update the customer's credit balance
        // 3. Send a response back to the client to update localStorage
        
        console.log(`Granted ${additionalCredits} credits to customer ${customerId}`);
        
        return NextResponse.json({ 
          success: true, 
          message: `Granted ${additionalCredits} credits to customer ${customerId}`,
          customerId,
          creditsGranted: additionalCredits
        });
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Error processing Autumn webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
} 