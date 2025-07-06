import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const customerId = request.headers.get("x-autumn-customer-id");
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID not found' },
        { status: 400 }
      );
    }

    // Call Autumn's API to get customer data
    if (process.env.AUTUMN_API_KEY) {
      try {
        const autumnResponse = await fetch(`https://api.autumn.com/v1/customers/${customerId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.AUTUMN_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (autumnResponse.ok) {
          const customerData = await autumnResponse.json();
          console.log('Autumn customer data:', customerData);
          
          // Get the messages feature balance
          const messagesBalance = customerData.features?.messages?.balance || 0;
          const usedCount = 5 - messagesBalance; // Convert balance to used count
          
          return NextResponse.json({ 
            success: true, 
            customerId,
            messagesBalance,
            usedCount,
            totalCredits: 5
          });
        } else {
          console.error('Autumn API error:', await autumnResponse.text());
          throw new Error('Failed to get customer data from Autumn');
        }
      } catch (autumnError) {
        console.error('Error calling Autumn API:', autumnError);
        return NextResponse.json({ 
          error: 'Failed to get customer data',
          fallback: true
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({ 
        error: 'Autumn API key not configured',
        fallback: true
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error getting credits:', error);
    return NextResponse.json(
      { error: 'Failed to get credits' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customerId, creditsToGrant } = await request.json();
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID not found' },
        { status: 400 }
      );
    }

    console.log(`Granting ${creditsToGrant} credits to customer: ${customerId}`);
    
    // In a real implementation, you would update the customer's credit balance in Autumn
    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      message: `Granted ${creditsToGrant} credits to customer ${customerId}`,
      customerId,
      creditsGranted: creditsToGrant
    });
  } catch (error) {
    console.error('Error granting credits:', error);
    return NextResponse.json(
      { error: 'Failed to grant credits' },
      { status: 500 }
    );
  }
} 