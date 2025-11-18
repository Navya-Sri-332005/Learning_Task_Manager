import React, { useState } from 'react';
import { api } from '../api';
import { saveAuth } from '../utils/auth';

export default function Signup({ onSignup, onSwitch }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [teacherId, setTeacherId] = useState('');
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const body = { email, password, role };
      if (role === 'student') body.teacherId = teacherId;
      const res = await api('/auth/signup', { method: 'POST', body });
      saveAuth(res.data);
      onSignup(res.data);
    } catch (e) { setErr(e.message || JSON.stringify(e)); }
  };

  return (
    // Apply the 'form-container' class for background and shadow
    <div className="form-container" style={{ maxWidth: 750 }}>
      <center><h2>Sign Up</h2></center>
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <form onSubmit={submit}>
        <div>
          <label>Email</label><br />
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <br></br>

        <div>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        
        <br></br>
        <div>
          <label>Role</label><br />
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        {role === 'student' && (
          <div>
            
        <br></br>
            <label>Teacher ID (paste teacher userId)</label><br />
            <input value={teacherId} onChange={e=>setTeacherId(e.target.value)} />
          </div>
        )}
        
        <br></br>
        <center><button type="submit">Sign up</button></center>
      </form>
      <p>Already have an account? <button className="switch-btn" onClick={onSwitch}>Login</button></p>
    </div>
  );
}