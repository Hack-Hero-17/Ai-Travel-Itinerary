import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ExpenseForm from "./ExpenseForm.jsx";
import BudgetTracker from "./BudgetTracker.jsx";
import ExpenseList from "./ExpenseList.jsx";
import axios from "axios";
import "./ExpenseTracker.css";

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(1000);
  const navigate = useNavigate();

  useEffect(() => {
    const userId =
      localStorage.getItem("userId") ||
      sessionStorage.getItem("userId") ||
      null;

    if (userId) {
      axios
        .get(`http://localhost:5000/api/expenses/${userId}`)
        .then((res) => {
          setExpenses(res.data);
        })
        .catch((err) => console.error("Error fetching expenses:", err));
    }
  }, []);

  const addExpense = async (expense) => {
    const userId =
      localStorage.getItem("userId") ||
      sessionStorage.getItem("userId") ||
      null;
    if (!userId) {
      console.error("User ID not found Error");
      return;
    }

    const res = await axios.post("http://localhost:5000/api/expenses", {
      ...expense,
      userId,
    });
    setExpenses([...expenses, res.data]);
  };

  const removeExpense = async (id) => {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    setExpenses(expenses.filter((expense) => expense._id !== id));
  };

  const editExpense = async (updateExpense) => {
    const res = await axios.put(
      `http://localhost:5000/api/expenses/${updateExpense._id}`,
      updateExpense
    );
    setExpenses(
      expenses.map((expense) =>
        expense._id === res.data._id ? res.data : expense
      )
    );
  };

  return (
    <div className="expense-tracker-wrapper font-helvetica">
      {/* Top Menubar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-blue-600 text-white shadow-md h-15">
        <button
          onClick={() => navigate("/")}
          className="text-white hover:scale-110 transition-transform"
        >
          <FaArrowLeft size={25} />
        </button>
        <h1 className="text-xl font-bold">Expense Tracker</h1>
        <div style={{ width: "22px" }}></div> {/* Spacer for symmetry */}
      </div>

      {/* Main Body */}
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
    </div>
  );
}

export default ExpenseTracker;
