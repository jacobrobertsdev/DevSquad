// DOM Elements
const addIncomeBtn = document.querySelector('#add-income');
const addExpenseBtn = document.querySelector('#add-expense');
const incomeSourceInput = document.querySelector('#income-source');
const incomeAmountInput = document.querySelector('#income-amount');
const expenseSourceInput = document.querySelector('#expense-source');
const expenseAmountInput = document.querySelector('#expense-amount');
const downloadBtn = document.querySelector('#download');
const resetBtn = document.querySelector('#reset');
const chartCanvas = document.querySelector('#budgetChart');

// Arrays to hold income and expense data
let incomeData = JSON.parse(localStorage.getItem('incomeData')) || [];
let expenseData = JSON.parse(localStorage.getItem('expenseData')) || [];

// Initial state for the chart (placeholder data)
const placeholderIncome = [
    { source: "Salary", amount: 2500 },
    { source: "Freelance", amount: 800 }
];

const placeholderExpenses = [
    { source: "Rent", amount: 1000 },
    { source: "Groceries", amount: 300 },
    { source: "Utilities", amount: 150 }
];

// Flag to track if the user has entered their own data
let hasUserEnteredData = incomeData.length > 0 || expenseData.length > 0;

// Chart variable
let chart = null;

// Initialize with data from localStorage or placeholder data
if (!hasUserEnteredData) {
    incomeData = [...placeholderIncome];
    expenseData = [...placeholderExpenses];
}

// Save data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem('incomeData', JSON.stringify(incomeData));
    localStorage.setItem('expenseData', JSON.stringify(expenseData));
}

// Reset function
function resetData() {
    // Reset incomeData, expenseData, and localStorage
    incomeData = [...placeholderIncome];
    expenseData = [...placeholderExpenses];
    localStorage.setItem('incomeData', JSON.stringify(incomeData));
    localStorage.setItem('expenseData', JSON.stringify(expenseData));

    // Reset form fields
    incomeSourceInput.value = '';
    incomeAmountInput.value = '';
    expenseSourceInput.value = '';
    expenseAmountInput.value = '';

    // Update chart and totals
    updateChart();
    updateTotals();
    resetList();
}

// Chart.js: Update the pie chart based on current data
function updateChart() {
    const totalIncome = incomeData.reduce((total, item) => total + item.amount, 0);
    const totalExpenses = expenseData.reduce((total, item) => total + item.amount, 0);

    const chartData = {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [totalIncome, totalExpenses],
            backgroundColor: ['#FF8C6B', '#40E0D0'], // Peach and Turquoise
            borderColor: ['#ee6787', '#30B8B4'],   // Darker borders
            borderWidth: 4
        }]
    };

    // Destroy the existing chart before creating a new one
    if (chart) {
        chart.destroy();
    }

    // Create new chart
    chart = new Chart(chartCanvas, {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.raw.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                        }
                    }
                }
            }
        }
    });
}

// Update totals (income, expenses, net balance)
function updateTotals() {
    const totalIncome = incomeData.reduce((total, item) => total + item.amount, 0);
    const totalExpenses = expenseData.reduce((total, item) => total + item.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    document.querySelector('#total-income').textContent = `Total income: $${totalIncome.toFixed(2)}`;
    document.querySelector('#total-expenses').textContent = `Total expenses: $${totalExpenses.toFixed(2)}`;
    document.querySelector('#net-balance').textContent = `Net balance: $${netBalance.toFixed(2)}`;
}

// Handle income addition
addIncomeBtn.addEventListener('click', () => {
    const source = incomeSourceInput.value.trim();
    const amount = parseFloat(incomeAmountInput.value);

    if (source && !isNaN(amount) && amount > 0) {
        // Clear placeholder data if the user enters their own data
        if (!hasUserEnteredData) {
            incomeData = [];
            expenseData = [];
            hasUserEnteredData = true;
        }

        

        incomeData.push({ source, amount });
        incomeSourceInput.value = '';
        incomeAmountInput.value = '';
        updateTotals();
        updateChart();
        updateIncomeList();
        
        // Save the data to localStorage
        saveDataToLocalStorage();
       
    } else {
        alert('Please enter a valid income source and amount.');
    }
});

// Handle expense addition
addExpenseBtn.addEventListener('click', () => {
    const source = expenseSourceInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);

    if (source && !isNaN(amount) && amount > 0) {
        // Clear placeholder data if the user enters their own data
        if (!hasUserEnteredData) {
            incomeData = [];
            expenseData = [];
            hasUserEnteredData = true;
        }


        expenseData.push({ source, amount });
        expenseSourceInput.value = '';
        expenseAmountInput.value = '';
        updateTotals();
        updateChart();
        updateExpenseList();

        // Save the data to localStorage
        saveDataToLocalStorage();
        
    } else {
        alert('Please enter a valid expense source and amount.');
    }
});

// Generate and download PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title of the document
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('BreadSheet Budget Tool', 10, 10);

    // Subtitle
    doc.setFontSize(14);
    doc.text('Summary', 10, 20);

    // Add total income, expenses, and balance
    const totalIncome = incomeData.reduce((total, item) => total + item.amount, 0);
    const totalExpenses = expenseData.reduce((total, item) => total + item.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    doc.setFontSize(12);
    doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 10, 30);
    doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 10, 40);
    doc.text(`Net Balance: $${netBalance.toFixed(2)}`, 10, 50);

    // Income sources list
    doc.setFont('Helvetica', 'bold');
    doc.text('Income Sources:', 10, 60);
    doc.setFont('Helvetica', 'normal');
    let yOffset = 70;
    incomeData.forEach((income) => {
        doc.text(`${income.source}: $${income.amount.toFixed(2)}`, 10, yOffset);
        yOffset += 10;
    });

    // Expenses list
    doc.setFont('Helvetica', 'bold');
    doc.text('Expenses:', 10, yOffset + 10);
    doc.setFont('Helvetica', 'normal');
    yOffset += 20;
    expenseData.forEach((expense) => {
        doc.text(`${expense.source}: $${expense.amount.toFixed(2)}`, 10, yOffset);
        yOffset += 10;
    });

    // Save the PDF
    doc.save('BreadSheet_budget_report.pdf');
}

//updates the display for the list of income sources and expenses that the user has inputed.
function updateExpenseList(){
    const expensesList = document.getElementById("expensesList");
    const placeholderText = document.getElementById("placeholderTextExpense");
    if(placeholderText){
        placeholderText.remove();
    }


    expenseData.forEach((expense, index) => {
        const listItem = document.createElement("li");
        listItem.id = "listItem"
        listItem.textContent = `${expense.source}: $${expense.amount.toFixed(2)}`
        expensesList.appendChild(listItem);



        if(index !== expenseData.length -1){
        const space = document.createElement("hr");
        space.id = "space";
        expensesList.appendChild(space);
        }
    
    });

}
function updateIncomeList(){
    const incomeSourceList = document.getElementById("incomeSourceList");
    const placeholderText = document.getElementById("placeholderTextIncome");
    placeholderText.remove();

    incomeData.forEach((income,index) =>{
        const listItem = document.createElement("li");
        listItem.id = "listItem"
        listItem.textContent = `${income.source}: $${income.amount.toFixed(2)}`
        incomeSourceList.appendChild(listItem);

        if(index !== incomeData.length -1){
            const space = document.createElement("hr");
            space.id = "space";
            incomeSourceList.appendChild(space);
            }
    });
}
//rests the Income and Expense List
function resetList(){
    //removes all list items added
    const elements = document.querySelectorAll('#listItem');
    elements.forEach(element => element.remove());

    //removes any placeholder text for income
    const placeholderIncome = document.querySelectorAll('#placeholderTextIncome');
    placeholderIncome.forEach(element => element.remove());

    //removes any placeholder text for expenses
    const placeholderExpense = document.querySelectorAll('#placeholderTextExpense');
    placeholderExpense.forEach(element => element.remove());

    //creates new placeholder text for income and appends
    const incomeSourceList = document.getElementById("incomeSourceList");
    const placeholderTextIncome = document.createElement("li");
    placeholderTextIncome.id = "placeholderTextIncome";
    placeholderTextIncome.textContent = "Add Data To Get Started";
    incomeSourceList.appendChild(placeholderTextIncome);

     //creates new placeholder text for expense and appends
    const expenseList = document.getElementById("expensesList");
    const placeholderTextExpense = document.createElement("li");
    placeholderTextExpense.id = "placeholderTextExpense";
    placeholderTextExpense.textContent = "Add Data To Get Started";
    expenseList.appendChild(placeholderTextExpense);

    //removes any hr elements in the list
    const spaces = document.querySelectorAll('#space');
    spaces.forEach(element => element.remove());

}




// Handle download click
downloadBtn.addEventListener('click', generatePDF);

// Handle reset click
resetBtn.addEventListener('click', resetData);

// Initialize the page with data from localStorage or placeholder data
updateChart();
updateTotals();
