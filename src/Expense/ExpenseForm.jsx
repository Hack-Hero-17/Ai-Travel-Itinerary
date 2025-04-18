import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./ExpenseTracker.css";

const categories = ["Transport", "Food", "Accomodation", "Other"];

const ExpenseForm = ({ onAddExpense }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && amount && category && date && place) {
      onAddExpense({
        id: uuidv4(),
        title,
        amount: parseFloat(amount),
        category,
        place,
        date,
      });
      setTitle("");
      setAmount("");
      setCategory("");
      setPlace("");
      setDate("");
    }
  };
  return (
    <form action="" onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Place"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
