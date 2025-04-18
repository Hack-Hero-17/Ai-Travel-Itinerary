import React, { useEffect, useState } from "react";
import ExpenseForm from "./ExpenseForm.jsx";
import BudgetTracker from "./BudgetTracker.jsx";
import ExpenseList from "./ExpenseList.jsx";
import axios from "axios";
import "./ExpenseTracker.css";

const userId =
  localStorage.getItem("userId") || sessionStorage.getItem("userId") || null; // example userId

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(1000);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/expenses/${userId}`).then((res) => {
      setExpenses(res.data);
    });
  }, []);

  const addExpense = async (expense) => {
    const res = await axios.post("http://localhost:5000/api/expenses", {
      ...expense,
      userId, // Ensure expId is set correctly
    });
    setExpenses([...expenses, res.data]);
  };

  const removeExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    setExpenses(expenses.filter((expense) => expense._id !== id)); // Fix to match _id
  };

  const editExpense = async (updateExpense) => {
    const res = await axios.put(
      `http://localhost:5000/api/expenses/${updateExpense._id}`,
      updateExpense
    );
    setExpenses(
      expenses.map(
        (expense) => (expense._id === res.data._id ? res.data : expense) // Fix to match _id
      )
    );
  };

  return (
    <>
      <div className="h1">Expense Tracker</div>
      <div className="body">
        <div className="container">
          <div className="left-section">
            <ExpenseForm onAddExpense={addExpense} />
            <BudgetTracker
              expenses={expenses}
              budget={budget}
              setBudget={setBudget}
            />
          </div>
          <div className="right-section">
            <ExpenseList
              expenses={expenses}
              onRemove={removeExpense}
              onEdit={editExpense}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ExpenseTracker;
