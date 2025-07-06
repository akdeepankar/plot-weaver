import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { featureId } = await request.json();
    const customerId = request.headers.get("x-autumn-customer-id");
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID not found' },
        { status: 400 }
      );
    }
    
    console.log(`Tracking usage for customer: ${customerId}, feature: ${featureId}`);
    
    // Call Autumn's API to track usage
    if (process.env.AUTUMN_API_KEY) {
      try {
        const autumnResponse = await fetch('https://api.autumn.com/v1/usage', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.AUTUMN_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: customerId,
            featureId: featureId,
            quantity: 1,
          }),
        });
        
        if (!autumnResponse.ok) {
          console.error('Autumn API error:', await autumnResponse.text());
          throw new Error('Failed to track usage in Autumn');
        }
        
        const autumnData = await autumnResponse.json();
        console.log('Autumn usage tracked successfully:', autumnData);
        
        return NextResponse.json({ 
          success: true, 
          customerId,
          autumnData 
        });
      } catch (autumnError) {
        console.error('Error calling Autumn API:', autumnError);
        // Fall back to just logging if Autumn API fails
        return NextResponse.json({ 
          success: true, 
          customerId,
          warning: 'Autumn API call failed, but usage logged locally'
        });
      }
    } else {
      console.log('AUTUMN_API_KEY not found, logging usage locally only');
      return NextResponse.json({ 
        success: true, 
        customerId,
        warning: 'Autumn API key not configured'
      });
    }
  } catch (error) {
    console.error('Error tracking usage:', error);
    return NextResponse.json(
      { error: 'Failed to track usage' },
      { status: 500 }
    );
  }
} 