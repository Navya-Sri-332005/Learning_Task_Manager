import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { readAuth, saveAuth, clearAuth } from './utils/auth';

function App(){
  const [auth, setAuth] = useState(readAuth());
  const [view, setView] = useState(auth ? 'dashboard' : 'login');

  useEffect(()=> { saveAuth(auth); }, [auth]);

  const logout = () => { clearAuth(); setAuth(null); setView('login'); };
  
  // Logic to determine the background class based on login state and role
  let backgroundClass = 'bg-unauthenticated';
  if (auth && auth.role === 'student') {
    backgroundClass = 'bg-student'; // Applies picture2
  } else if (auth && auth.role === 'teacher') {
    backgroundClass = 'bg-teacher'; // Applies picture3
  }

  return (
    // Apply the determined class to the top-level div
    <div className={backgroundClass} style={{ 
      padding: 24,
      maxWidth: 1000,
      margin: '0 auto',
      width: '100%',
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: (view === 'login' || view === 'signup') ? "center" : "flex-start",
      alignItems: "center"
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: 1000,
        padding: 24,
        boxSizing: 'border-box'
      }}>
        
        <header style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          /*maxWidth: '952px',*/
          /*backgroundColor: auth ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
          borderRadius: auth ? '8px' : '0',
          padding: auth ? '10px 20px' : '0' */
        }}>
          <h2 style={{ 
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            margin: 0
          }}>
            Learning Task Manager
          </h2>

          {auth && (
            <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'flex-end', // Align items to the right
            marginLeft: 'auto' // Pushes the container to the far right
            }}>
            {/* User Info as smaller text (simulating <h4> size) */}
            <h4 style={{ margin: '0 0 5px 0', fontSize: '1em' }}>
            {auth.email} ({auth.role})
            </h4>
            
            {/* Logout Button */}
            <button onClick={logout}>Logout</button>
            </div>
            )}
            </header>

        <main style={{ marginTop: 20, width: '100%', flexGrow: 1 }}>
          {(view === 'login' || view === 'signup') ? (
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              {view === 'login' &&
                <Login 
                  onLogin={(u)=>{ setAuth(u); setView('dashboard'); }}
                  onSwitch={()=>setView('signup')} 
                />
              }

              {view === 'signup' &&
                <Signup 
                  onSignup={(u)=>{ setAuth(u); setView('dashboard'); }}
                  onSwitch={()=>setView('login')} 
                />
              }
            </div>
          ) : (
            view === 'dashboard' && auth && <Dashboard auth={auth} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
