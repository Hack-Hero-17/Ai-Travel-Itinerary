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
    <div className='expense-list'>
        {expenses.length===0 ?
        (<p>No Expenses Yet!!!</p>):
        (expenses.map((ex)=>
        editId==ex.id ? 
        (<div key={ex.id} className="expense-item">
            <input type="text" name="title" value={editData.title} onChange={handleEdit} placeholder="Title"/>
            <input type="number" name="amount" value={editData.amount} onChange={handleEdit} placeholder="Amount"/>
            <input type="date" name="date" value={editData.date} onChange={handleEdit}/>
            <select name="category" value={editData.category} onChange={handleEdit}>
              <option value="">Select Category</option>
              <option value="Transport">Transport</option>
              <option value="Food">Food</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Other">Other</option>
            </select>
            <input type="text" name="place" value={editData.place} onChange={handleEdit} placeholder="Place"/>
            <button onClick={saveEdit}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </div>):
          (<div key={ex.id} className="expense-item">
              <h3>{ex.title}</h3>
              <p>Amount: ${ex.amount.toFixed(2)}</p>
              <p>Category: {ex.category}</p>
              <p>Place: {ex.place}</p>
              <p>Date: {new Date(ex.date).toLocaleDateString()}</p>
              <button className="edit-btn" onClick={() => startEdit(ex)}>Edit</button>
              <button className="cancel-btn" onClick={() => onRemove(ex.id)}>Remove</button>
            </div>
        )))}
    </div>
    );
};

export default ExpenseList;
