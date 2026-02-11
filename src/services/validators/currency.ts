/**
 * Parse currency string to number
 * @param value - Currency string (e.g., "R$ 1.000,00")
 * @returns Numeric value
 */
export const parseCurrency = (value: string): number => {
    const cleanStr = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanStr);
};

/**
 * Parse currency from masked input (cents-based)
 * @param value - Masked currency string
 * @returns Numeric value
 */
export const parseMaskedCurrency = (value: string): number => {
    return parseFloat(value.replace(/\D/g, '')) / 100;
};
