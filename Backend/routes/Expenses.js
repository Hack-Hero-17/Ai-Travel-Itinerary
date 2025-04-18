// routes/expenses.js
const express = require("express");
const router = express.Router();
const Expense = require("../models/Expenses");

// Get all expenses for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const expenses = await Expense.find({ userId });
  res.json(expenses);
});

// Add an expense
router.post("/", async (req, res) => {
  const expense = new Expense(req.body);
  const saved = await expense.save();
  res.json(saved);
});

// Update an expense
router.put("/:Id", async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.Id },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an expense
router.delete("/:Id", async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({ _id: req.params.Id });

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
