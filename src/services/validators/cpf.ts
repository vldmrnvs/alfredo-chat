/**
 * Validates Brazilian CPF using official algorithm
 * @param cpf - CPF string (can include formatting)
 * @returns true if valid CPF
 */
export const isValidCPF = (cpf: string): boolean => {
    const cleaned = cpf.replace(/[^\d]+/g, '');
    if (cleaned === '' || cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;

    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cleaned.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cleaned.charAt(9))) return false;

    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cleaned.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cleaned.charAt(10))) return false;

    return true;
};
