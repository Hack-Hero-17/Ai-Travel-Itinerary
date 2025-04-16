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
        <div className="container">
          <div className="left-section">
            <ExpenseForm onAddExpense={addExpense}/>
            <BudgetTracker expenses={expenses} budget={budget} setBudget={setBudget}/>
          </div> 
          <div className="right-section">
            <ExpenseList expenses={expenses} onRemove={removeExpense} onEdit={editExpense}/>
          </div>
        </div>
      </>
    );
  
}

export default ExpenseTracker
