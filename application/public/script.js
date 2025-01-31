// DOM Elements
const addIncomeBtn = document.querySelector("#add-income");
const addExpenseBtn = document.querySelector("#add-expense");
const incomeSourceInput = document.querySelector("#income-source");
const incomeAmountInput = document.querySelector("#income-amount");
const expenseSourceInput = document.querySelector("#expense-source");
const expenseAmountInput = document.querySelector("#expense-amount");
const downloadBtn = document.querySelector("#download");
const resetBtn = document.querySelector("#reset");
const chartCanvas = document.querySelector("#budgetChart");
const incomeList = document.querySelector(".income-list");
const expenseList = document.querySelector(".expense-list");
const message = document.querySelector('.message');

// Arrays to hold income and expense data
let incomeData = JSON.parse(localStorage.getItem("incomeData")) || [];
let expenseData = JSON.parse(localStorage.getItem("expenseData")) || [];

// Chart variable
let chart = null;

// Initialize the chart with placeholder data
function initializeChart() {
    const placeholderIncome = 500;
    const placeholderExpenses = 500;

    const chartData = {
        labels: ["Income", "Expenses"],
        datasets: [
            {
                data: [placeholderIncome, placeholderExpenses],
                backgroundColor: ["#40E0D0", "#FF8C6B"], // Peach and Turquoise
                borderColor: ["#30B8B4", "#ee6787"], // Darker borders
                borderWidth: 4,
            },
        ],
    };

    // Create the initial chart with placeholder data
    chart = new Chart(chartCanvas, {
        type: "pie",
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.raw.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            });
                        },
                    },
                },
            },
        },
    });
}

// Function to hide an element
function hide(element) {
    if (!element.classList.contains('hidden')) {
        element.classList.add("hidden");
    };
}

// Function to show an element
function show(element) {
    if (element.classList.contains('hidden')) {
        element.classList.remove("hidden");
    };
}

// Save data to localStorage
function saveDataToLocalStorage() {
    localStorage.setItem("incomeData", JSON.stringify(incomeData));
    localStorage.setItem("expenseData", JSON.stringify(expenseData));
}

// Reset function
function resetData() {
    // Reset incomeData, expenseData, and localStorage
    incomeData = [];
    expenseData = [];

    // Reset form fields
    incomeSourceInput.value = "";
    incomeAmountInput.value = "";
    expenseSourceInput.value = "";
    expenseAmountInput.value = "";

    // Update chart and totals
    if (chart) chart.destroy();
    initializeChart();
    updateTotals();
    appendToList(incomeList, incomeData);
    appendToList(expenseList, expenseData);
    localStorage.removeItem('incomeData');
    localStorage.removeItem('expenseData');
    show(message);
}

// Chart.js: Update the pie chart based on current data
function updateChart() {
    const totalIncome = incomeData.reduce(
        (total, item) => total + item.amount,
        0
    );
    const totalExpenses = expenseData.reduce(
        (total, item) => total + item.amount,
        0
    );

    const chartData = {
        labels: ["Income", "Expenses"],
        datasets: [
            {
                data: [totalIncome, totalExpenses],
                backgroundColor: ["#40E0D0", "#FF8C6B"], // Peach and Turquoise
                borderColor: ["#30B8B4", "#ee6787"], // Darker borders
                borderWidth: 4,
            },
        ],
    };

    // Destroy the existing chart before creating a new one
    if (chart) {
        chart.destroy();
    }

    // Create new chart with actual data
    chart = new Chart(chartCanvas, {
        type: "pie",
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.raw.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            });
                        },
                    },
                },
            },
        },
    });
}

// Update totals (income, expenses, net balance)
function updateTotals() {
    const totalIncome = incomeData.reduce(
        (total, item) => (total += item.amount),
        0
    );
    const totalExpenses = expenseData.reduce(
        (total, item) => (total += item.amount),
        0
    );
    const netBalance = totalIncome - totalExpenses;

    document.querySelector(".totals-income").textContent = totalIncome
        ? `${totalIncome.toFixed(2)}`
        : "0.00";
    document.querySelector(".totals-expenses").textContent = totalExpenses
        ? `${totalExpenses.toFixed(2)}`
        : "0.00";
    document.querySelector(".totals-net").textContent = netBalance
        ? `${netBalance.toFixed(2)}`
        : "0.00";
}

// List item creation for lists
function appendToList(list, data) {
    // Store the hardcoded elements (e.g., <li> and <hr>)
    const placeholders = list.querySelectorAll(".placeholder");

    // Clear the list (but keep the hardcoded items)
    list.innerHTML = "";
    placeholders.forEach((item) => list.appendChild(item));

    data.forEach((item) => {
        const listItem = document.createElement("li"); // Create a new <li> element
        const sourceSpan = document.createElement("span");
        const amtSpan = document.createElement("span");
        sourceSpan.textContent = `${item.source}:`;
        amtSpan.textContent = `$${item.amount}`;
        listItem.appendChild(sourceSpan);
        listItem.appendChild(amtSpan);
        list.appendChild(listItem);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    // Check if incomeData and expenseData have data in localStorage
    if (incomeData.length > 0 || expenseData.length > 0) {
        // Hide the message if there's data
        hide(message);
    } else {
        // Show the message if there is no data
        show(message);
    }

    // Append the data to the list
    appendToList(incomeList, incomeData);
    appendToList(expenseList, expenseData);
});


// Handle income addition
addIncomeBtn.addEventListener("click", () => {
    hide(message);
    const source = incomeSourceInput.value.trim();
    const amount = parseFloat(incomeAmountInput.value);

    if (source && !isNaN(amount) && amount > 0) {
        incomeData.push({ source, amount });
        appendToList(incomeList, incomeData);
        incomeSourceInput.value = "";
        incomeAmountInput.value = "";
        updateTotals();
        updateChart();

        // Save the data to localStorage
        saveDataToLocalStorage();
    } else {
        alert("Please enter a valid income source and amount.");
    }
});

// Handle expense addition
addExpenseBtn.addEventListener("click", () => {
    hide(message);
    const source = expenseSourceInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);

    if (source && !isNaN(amount) && amount > 0) {
        expenseData.push({ source, amount });
        appendToList(expenseList, expenseData);
        expenseSourceInput.value = "";
        expenseAmountInput.value = "";
        updateTotals();
        updateChart();
        // Save the data to localStorage
        saveDataToLocalStorage();
    } else {
        alert("Please enter a valid expense source and amount.");
    }
});

// Generate and download PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Title of the document
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("BreadSheet Budget Tool", 10, 10);

    // Subtitle
    doc.setFontSize(14);
    doc.text("Summary", 10, 20);

    // Add total income, expenses, and balance
    const totalIncome = incomeData.reduce(
        (total, item) => total + item.amount,
        0
    );
    const totalExpenses = expenseData.reduce(
        (total, item) => total + item.amount,
        0
    );
    const netBalance = totalIncome - totalExpenses;

    doc.setFontSize(12);
    doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 10, 30);
    doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 10, 40);
    doc.text(`Net Balance: $${netBalance.toFixed(2)}`, 10, 50);

    // Income sources list
    doc.setFont("Helvetica", "bold");
    doc.text("Income Sources:", 10, 60);
    doc.setFont("Helvetica", "normal");
    let yOffset = 70;
    incomeData.forEach((income) => {
        doc.text(`${income.source}: $${income.amount.toFixed(2)}`, 10, yOffset);
        yOffset += 10;
    });

    // Expenses list
    doc.setFont("Helvetica", "bold");
    doc.text("Expenses:", 10, yOffset + 10);
    doc.setFont("Helvetica", "normal");
    yOffset += 20;
    expenseData.forEach((expense) => {
        doc.text(`${expense.source}: $${expense.amount.toFixed(2)}`, 10, yOffset);
        yOffset += 10;
    });

    // Save the PDF
    doc.save("BreadSheet_budget_report.pdf");
}

// Handle download click
downloadBtn.addEventListener("click", generatePDF);

// Handle reset click
resetBtn.addEventListener("click", resetData);

// Initialize the page with data from localStorage or placeholder data
initializeChart();
updateTotals();
