const transactionsUl = document.querySelector ('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')


const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))

let transactions = localStorage
.getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions
    .filter(transactions => transactions.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = (transaction) => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount)
    
    const li = document.createElement('li')
    li.classList.add(CSSClass)
    li.innerHTML = `
        ${transaction.name}
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
        x
        </button>
    `
    transactionsUl.append(li) //ultimo filho, se fosse o primeiro filho seria prepend
}

const updateBalanceValues = () => {
    const transactionsAmount = transactions
        .map(transaction => transaction.amount )
    const total  = transactionsAmount
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2)
    const income = transactionsAmount
        .filter(value => value > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2)
    const expense = Math.abs(transactionsAmount
        .filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0))
        .toFixed(2)

    balanceDisplay.textContent = ` R$ ${total}`
    incomeDisplay.textContent = ` R$ ${income}`
    expenseDisplay.textContent = ` R$ ${expense}`
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const AddToTransactionsArray = (transactionName, transactionAmount, id) => {
    transactions.push({
        id : id, 
        name: transactionName, 
        amount: Number(transactionAmount)
    });
}

const handleFormSubmit = event => { 
    event.preventDefault()

    const transactionName =  inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const id = transactions.length

    if(transactionName === '' || transactionAmount === ''){
        alert("Por favor, preencha o nome e o valor da transação")
        return
    }

    AddToTransactionsArray(transactionName, transactionAmount, id)
    init()
    updateLocalStorage()

    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

form.addEventListener('submit', handleFormSubmit)