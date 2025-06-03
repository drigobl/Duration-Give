// Currency conversion rates (as of April 2024)
// In a real app, these would be fetched from an API
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  CAD: 1.35,
  EUR: 0.92,
  CNY: 7.23,
  JPY: 151.68,
  KRW: 1345.78,
  AED: 3.67,
  AUD: 1.51,
  CHF: 0.90,
  GBP: 0.79,
  INR: 83.42,
  MXP: 16.73,
  ILS: 3.68,
  NGN: 1550.0,
  HKD: 7.82,
  PKR: 278.25
};

// Currency symbols
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  CAD: 'C$',
  EUR: '€',
  CNY: '¥',
  JPY: '¥',
  KRW: '₩',
  AED: 'د.إ',
  AUD: 'A$',
  CHF: 'CHF',
  GBP: '£',
  INR: '₹',
  MXP: 'Mex$',
  ILS: '₪',
  NGN: '₦',
  HKD: 'HK$',
  PKR: '₨'
};

// Utility functions for money formatting and calculations
export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  // Convert amount to the target currency
  const rate = EXCHANGE_RATES[currencyCode] || 1;
  const convertedAmount = amount * rate;
  
  // Format the amount according to the currency
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(convertedAmount);
};

export const calculateEquityGrowth = (amount: number): number => {
  return amount * 0.12; // 12% growth rate
};