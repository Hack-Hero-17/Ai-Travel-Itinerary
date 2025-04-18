// models/Expense.js
const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: String,
    amount: Number,
    category: String,
    place: String,
    date: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);
