/**
 * Formats a number as Indian Rupee (INR) currency.
 * @param {number} amount - The amount to format.
 * @returns {string} - The formatted currency string (e.g., ₹1,299).
 */
export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0';

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Returns currency parts for custom styling.
 * @param {number} amount 
 * @returns {object} { symbol: '₹', value: '1,200' }
 */
export const formatCurrencyParts = (amount) => {
    const formatted = formatCurrency(amount);
    return {
        symbol: '₹',
        value: formatted.replace('₹', '').trim()
    };
};

export default formatCurrency;
