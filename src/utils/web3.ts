// Update formatBalance to handle BigInt without literals
export const formatBalance = (balance: string | number | bigint): string => {
  try {
    // Handle empty or invalid input
    if (!balance) return '0.00';
    
    // Convert to string first to handle all input types
    const balanceStr = balance.toString().replace(/[^\d]/g, '');
    
    // Handle empty string after sanitization
    if (!balanceStr) return '0.00';
    
    // Convert to BigInt safely
    const value = BigInt(balanceStr);
    const divisor = BigInt('1000000000000'); // 1e12 for DOT conversion
    const whole = value / divisor;
    const fraction = value % divisor;
    
    return `${whole}.${fraction.toString().padStart(12, '0')}`;
  } catch (error) {
    console.error('Error formatting balance:', error);
    return '0.00';
  }
};

export const shortenAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const isValidAddress = (address: string): boolean => {
  // Check for Ethereum address format
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return true;
  }
  
  // Check for Polkadot address format
  if (/^[1-9A-HJ-NP-Za-km-z]{47,48}$/.test(address)) {
    return true;
  }

  return false;
};