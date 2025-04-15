import React, {useState} from "react";
import ExpenseForm from "./ExpenseForm.jsx";
import BudgetTracker from "./BudgetTracker.jsx";
import ExpenseList from "./ExpenseList.jsx";
import './ExpenseTracker.css';




function ExpenseTracker() 
{
  const [expenses,setExpenses]=useState([]);
  const [budget,setBudget]=useState(1000);

  const addExpense=(expense)=>{
    setExpenses([...expenses,expense]);
  }

  const removeExpense=(id)=>{
    setExpenses(expenses.filter((expense) => expense.id!==id));
  }

  const editExpense=(updateExpense)=>{
    setExpenses(
      expenses.map((expense) =>
        expense.id===updateExpense.id?updateExpense:expense
      )
    );
  }
    return(
      <>
        <h1>Expense Tracker</h1>
        <ExpenseForm onAddExpense={addExpense}/>
        <ExpenseList expenses={expenses} onRemove={removeExpense} onEdit={editExpense}/>
        <BudgetTracker expenses={expenses} budget={budget} setBudget={setBudget}/>
      </>
    );
  
}

export default ExpenseTracker
