import React, { useState } from 'react';

export default function TaskForm({ auth, initial = {}, onSave }){
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [dueDate, setDueDate] = useState(initial.dueDate ? new Date(initial.dueDate).toISOString().slice(0,10) : '');
  const [progress, setProgress] = useState(initial.progress || 'not-started');

const submit = (e) => {
    e.preventDefault();
    
    // --- START MODIFIED SUBMISSION LOGIC ---
    let payload = {};
    const isEditing = !!initial._id; // Check if an existing task is being passed

    if (isEditing) {
        // If editing, only send fields allowed by the backend (which you restricted to 'progress')
        payload = { progress };
    } else {
        // If creating a new task, send all fields
        payload = { 
            userId: auth.id, 
            title, 
            description, 
            dueDate: dueDate || undefined, 
            progress 
        };
    }
    
    onSave(payload);
    // --- END MODIFIED SUBMISSION LOGIC ---
  };

  return (
    <form onSubmit={submit} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
      <div>
        <label>Title</label><br />
        <input value={title} onChange={e=>setTitle(e.target.value)} required />
      </div>
      <br></br>
      <div>
        <label>Description</label><br />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} />
      </div>
      <div>
        <label>Due Date</label><br />
        <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
      </div>
      <br></br>
      <div>
        <label>Progress</label><br />
        <select value={progress} onChange={e=>setProgress(e.target.value)}>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <br></br>
      <center><button type="submit">Save</button></center>
    </form>
  );
}
