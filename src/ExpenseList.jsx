import React, { useState, useSyncExternalStore } from "react";
import './ExpenseTracker.css';



const ExpenseList=({expenses,onRemove,onEdit})=>{
    const [editId,setEditId]=useState(null);
    const [editData,setEditData]=useState({title: "", amount: "",category: "",place: "",date: ""});
    
    const handleEdit=(e)=>{
        const {name,value}=e.target;
        setEditData({...editData,[name]:value});
    };
    const startEdit=(expense)=>{
        setEditId(expense.id);
        setEditData(expense);
    }
    const cancelEdit=()=>{
        setEditId(null);
        setEditData({});
    };
    const saveEdit=()=>{
        onEdit({...editData, amount:parseFloat(editData.amount)});
        setEditId(null);
    }

    return(
        <div className="expense-list">
        {expenses.length === 0 ? (
          <p>No Expenses Yet!!!</p>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Place</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((ex) =>
                editId === ex.id ? (
                  <tr key={ex.id}>
                    <td>
                      <input type="text" name="title" value={editData.title} onChange={handleEdit} placeholder="Title"/>
                    </td>
                    <td>
                      <input type="number" name="amount" value={editData.amount} onChange={handleEdit} placeholder="Amount" />
                    </td>
                    <td>
                      <select name="category" value={editData.category} onChange={handleEdit}>
                        <option value="">Select Category</option>
                        <option value="Transport">Transport</option>
                        <option value="Food">Food</option>
                        <option value="Accommodation">Accommodation</option>
                        <option value="Other">Other</option>
                      </select>
                    </td>
                    <td>
                      <input type="text" name="place" value={editData.place} onChange={handleEdit} placeholder="Place" />
                    </td>
                    <td>
                      <input type="date" name="date" value={editData.date} onChange={handleEdit} />
                    </td>
                    <td>
                      <button className="save-btn" onClick={saveEdit}>Save</button>
                      <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={ex.id}>
                    <td>{ex.title}</td>
                    <td>₹{ex.amount.toFixed(2)}</td>
                    <td>{ex.category}</td>
                    <td>{ex.place}</td>
                    <td>{new Date(ex.date).toLocaleDateString()}</td>
                    <td>
                      <button className="edit-btn" onClick={() => startEdit(ex)}>
                        Edit
                      </button>
                      <button className="remove-btn" onClick={() => onRemove(ex.id)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
      
    );
};

export default ExpenseList;