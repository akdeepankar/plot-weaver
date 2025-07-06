// Autumn client-side utilities
const CUSTOMER_ID_KEY = 'autumn-customer-id';

export function getCustomerId(): string {
  if (typeof window === 'undefined') return '';
  
  let customerId = localStorage.getItem(CUSTOMER_ID_KEY);
  if (!customerId) {
    customerId = 'user-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(CUSTOMER_ID_KEY, customerId);
  }
  return customerId;
}

export function setCustomerId(customerId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CUSTOMER_ID_KEY, customerId);
}

export function getAutumnHeaders(): HeadersInit {
  const customerId = getCustomerId();
  return {
    'x-autumn-customer-id': customerId,
    'Authorization': `Bearer ${customerId}`,
  };
}

// Enhanced fetch function for Autumn API calls
export async function autumnFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    ...options.headers,
    ...getAutumnHeaders(),
  };
  
  return fetch(url, {
    ...options,
    headers,
  });
}

// Set customer ID as cookie for server-side access
export function setCustomerIdCookie(): void {
  if (typeof window === 'undefined') return;
  const customerId = getCustomerId();
  document.cookie = `autumn-customer-id=${customerId}; path=/; max-age=31536000`; // 1 year
} 