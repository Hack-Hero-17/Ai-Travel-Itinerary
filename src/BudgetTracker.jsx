import React from 'react';
import './ExpenseTracker.css';


const BudgetTracker=({expenses,budget,setBudget})=>{
    const total=expenses.reduce((sum,expense)=>sum+expense.amount,0);
    const remaining=budget-total;

    return(
        <div className='budget-tracker'>
            <h4>Set Budget: 
            <input type="number" value={budget} onChange={(e)=>setBudget(e.target.value) || 0} placeholder='Set Budget'/></h4>
            <h3>Budget: ${budget}</h3>
            <h3>Spent Amount: ${total.toFixed(2)}</h3>
            <h3>Remaining Amount: ${remaining.toFixed(2)}</h3>
        </div>
    )
}

export default BudgetTracker;
