/**
 * Phone validation for Brazilian phone numbers
 * @param phone - Phone string (can include formatting)
 * @returns true if valid (10-11 digits)
 */
export const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
};
