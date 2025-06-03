export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // Only require minimum length of 8 characters
  return password.length >= 8;
}

export function validateAmount(amount: number): boolean {
  return amount > 0 && amount <= 1000000 && Number.isFinite(amount);
}

export function validateAuthInput(email: string, password: string): void {
  if (!validateEmail(email)) {
    throw new Error('Please enter a valid email address');
  }
  
  if (!validatePassword(password)) {
    throw new Error('Password must be at least 8 characters long');
  }
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input.replace(/[<>'"]/g, '');
}

export function validateFileUpload(file: File): void {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB');
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type must be PDF, JPEG, or PNG');
  }
}

export function isValidAmount(amount: number): boolean {
  return amount > 0 && amount <= 1000000 && !isNaN(amount);
}

export function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic phone validation - can be enhanced for specific formats
  return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone);
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}