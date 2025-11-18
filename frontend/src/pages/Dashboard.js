import React, { useState, useEffect } from 'react';
import { api } from '../api';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

export default function Dashboard({ auth }){
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [filterProgress, setFilterProgress] = useState('');
  const [dueFilter, setDueFilter] = useState(''); // week|overdue

  useEffect(()=> { fetchTasks(); }, [filterProgress, dueFilter]);

  async function fetchTasks(){
    setLoading(true); setError(null);
    try {
      const qs = {};
      if (filterProgress) qs.progress = filterProgress;
      if (dueFilter) qs.due = dueFilter;
      const res = await api('/tasks', { token: auth.token, qs });
      setTasks(res.data);
    } catch (e) { setError(e.message || JSON.stringify(e)); }
    setLoading(false);
  }

  const createTask = async (payload) => {
    try {
      const res = await api('/tasks', { method: 'POST', token: auth.token, body: payload });
      setTasks(prev => [res.data, ...prev]);
    } catch (e) { alert(e.message || JSON.stringify(e)); }
  };

  const updateTask = async (id, payload) => {
    try {
      const res = await api(`/tasks/${id}`, { method: 'PUT', token: auth.token, body: payload });
      setTasks(prev => prev.map(t => t._id === id ? res.data : t));
      setEditing(null);
    } catch (e) { alert(e.message || JSON.stringify(e)); }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api(`/tasks/${id}`, { method: 'DELETE', token: auth.token });
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (e) { alert(e.message || JSON.stringify(e)); }
  };

  const handleSave = (payload) => {
    if (editing) {
      updateTask(editing._id, payload);
    } else {
      createTask(payload);
    }
  };

  return (
    <div>
      <center><h3>Dashboard</h3></center>
      <div>
        <div style={{ marginBottom: 12 }}>
          <label>Filter by Progress: </label>
          <select value={filterProgress} onChange={e=>setFilterProgress(e.target.value)}>
            <option value="">(all)</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <br></br>
          <br></br>
          <label style={{ marginLeft: 12 }}>Due filter:</label>
          <select value={dueFilter} onChange={e=>setDueFilter(e.target.value)}>
            <option value="">(all)</option>
            <option value="week">Due this week</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        <TaskForm auth={auth} initial={editing||{}} onSave={async (payload)=>{
          await handleSave(payload);
        }} />

        {loading ? <div>Loading...</div> : (
          <>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <TaskList tasks={tasks} onEdit={(t)=>setEditing(t)} onDelete={deleteTask} auth={auth} />
          </>
        )}
      </div>
    </div>
  );
}
