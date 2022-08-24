// Select Elements
const balance = document.getElementById("balance");
const money_income = document.getElementById("money__income");
const money_expense = document.getElementById("money__expense");
const list = document.getElementById("list");
const form = document.getElementById("new-transaction");
const message = document.getElementById("text");
const amount = document.getElementById("amount");

// Initialize dummy transactions to display
const dummyTransactions = [
  { id: 1, message: "Flowers", amount: -20 },
  { id: 2, message: "Salary", amount: 300 },
  { id: 3, message: "Book", amount: -10 },
  { id: 4, message: "Camera", amount: -150 },
  { id: 5, message: "Transfer", amount: 75 },
];

//////////////////////////////////////////////////////
//
//     FUNCTIONS
//
//////////////////////////////////////////////////////

// Initialize transactions list variable with dummy objects
const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Determine Income / Expense
  const sign = transaction.amount > 0 ? "+" : "-";
  const listItem = document.createElement("li");
  // Add class based on value
  listItem.classList.add("transaction");
  listItem.classList.add(
    sign == "+" ? "transaction__income" : "transaction__expense"
  );

  listItem.innerHTML = `${transaction.message}
	<span class="transaction__amount
	amount__${sign == "+" ? "income" : "expense"}">
	${sign}$${Math.abs(transaction.amount)}</span>
	<button class="btn__delete" onclick="removeTransaction(${
    transaction.id
  })">x</button>`;

  list.appendChild(listItem);
}

// Add user submitted transaction to the transactions array
function addTransaction(e) {
  e.preventDefault();

  if (message.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a message and transaction amount before submitting");
  }

  const transaction = {
    id: randomID(),
    message: message.value,
    amount: +amount.value,
  };
  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();
  message.value = "";
  amount.value = "";
}
// Generate Random transaction id

function randomID() {
  return Math.floor(Math.random() * 100000000);
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Init
function init() {
  //Reset the HTML for the transaction list
  list.innerHTML = "";
  // transactions.forEach((transaction) => addTransactionDOM(transaction));\
  // Add all transactions to the transaction list
  transactions.forEach(addTransactionDOM);
  // Update totals for Balance, Income and Expenses
  updateValues();
}

// Remove transaction by id
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  init();
  updateLocalStorage();
}

// Update the balance, income, and expense values
function updateValues() {
  const currentAmounts = transactions.map((transaction) => transaction.amount);
  console.log(currentAmounts);
  const transactionsSum = currentAmounts
    .reduce((acc, cur) => (acc += cur), 0)
    .toFixed(2);

  const totalIncome = currentAmounts
    .filter((transaction) => transaction > 0)
    .reduce((acc, cur) => (acc += cur), 0)
    .toFixed(2);

  const totalExpenses = currentAmounts
    .filter((transaction) => transaction < 0)
    .reduce((acc, cur) => (acc += cur), 0)
    .toFixed(2);

  balance.innerText = `${transactionsSum > 0 ? "+" : "-"}$${transactionsSum}`;
  money_income.innerText = `${totalIncome > 0 ? "+" : "-"}$${totalIncome}`;
  money_expense.innerText = `${totalExpenses > 0 ? "+" : "-"}$${Math.abs(
    totalExpenses
  ).toFixed(2)}`;
}

//////////////////////////////////////////////////////
//
//     Event Listeners
//
//////////////////////////////////////////////////////

form.addEventListener("submit", addTransaction);

//////////////////////////////////////////////////////
//
//     Main Script
//
//////////////////////////////////////////////////////

//Init App
init();
