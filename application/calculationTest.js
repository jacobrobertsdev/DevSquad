function calculateTotals(incomeData, expenseData) {
    const totalIncome = incomeData.reduce((total, item) => total + item.amount, 0);
    const totalExpenses = expenseData.reduce((total, item) => total + item.amount, 0);
    return { totalIncome, totalExpenses }
}

function calculateNetBalance(incomeData, expenseData) {
    const { totalIncome, totalExpenses } = calculateTotals(incomeData, expenseData);
    const netBalance = totalIncome - totalExpenses;
    return netBalance;
}


module.exports = { calculateTotals, calculateNetBalance };
