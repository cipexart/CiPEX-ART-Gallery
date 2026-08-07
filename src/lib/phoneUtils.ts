/**
 * Utility functions for validating and formatting Moroccan Phone Numbers
 * Rule: Must start with 05, 06, or 07 and contain exactly 10 digits.
 * No country codes (+) or extra prefixes allowed.
 */

export function cleanMoroccanPhone(input: string): string {
  if (!input) return '';
  // Remove all non-digit characters
  let cleaned = input.trim().replace(/\D/g, '');

  // Strip international country code prefix if user pastes 212... or 00212...
  if (cleaned.startsWith('00212')) {
    cleaned = '0' + cleaned.slice(5);
  } else if (cleaned.startsWith('212')) {
    cleaned = '0' + cleaned.slice(3);
  }

  return cleaned;
}

export function isValidMoroccanPhone(phone: string): boolean {
  const cleaned = cleanMoroccanPhone(phone);
  return /^(05|06|07)\d{8}$/.test(cleaned);
}

export function getMoroccanPhoneError(isAr: boolean = true): string {
  return isAr
    ? 'رقم الهاتف غير صحيح! يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام (مثال: 0699745621)'
    : 'Numéro invalide! Doit commencer par 05, 06 ou 07 et contenir 10 chiffres (ex: 0699745621)';
}
