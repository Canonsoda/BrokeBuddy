export function calculateSimpleInterest(principal, rate, time) {
    return (principal * rate * time) / (12 * 100);
}

export function calculateCompoundInterest(principal, rate, time, n = 1) {
    const years = time / 12;
    return principal * Math.pow((1 + rate / (n * 100)), n * years) - principal;
}

export const calculateTotalAmount = ({ principal, rate, time, type = 'simple' }) => {
    const interest = type === 'compound'
        ? calculateCompoundInterest(principal, rate, time)
        : calculateSimpleInterest(principal, rate, time);
    return Math.round(principal + interest);
};
