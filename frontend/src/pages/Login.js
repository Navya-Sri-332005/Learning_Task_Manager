import React, { useState } from 'react';
import { api } from '../api';
import { saveAuth } from '../utils/auth';

export default function Login({ onLogin, onSwitch }){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api('/auth/login', { method: 'POST', body: { email, password } });
      saveAuth(res.data);
      onLogin(res.data);
    } catch (err) { setErr(err.message || JSON.stringify(err)); }
  };

  return (
    // Apply the 'form-container' class for background and shadow
    <div className="form-container" style={{ maxWidth: 540 }}>
      <center>
      <h3>Login</h3></center>
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
        
        <button
          className="submit-btn" 
          type="submit"
          style={{ height: '40px', width: '250px', margin: '20px auto 8px auto', display: 'block' }} // ADDED style
        ><center>Login</center>
        </button>
        
      </form>
      <p>Don't have an account? <button className="switch-btn" onClick={onSwitch}>Sign up</button></p>
    </div>
  );
}