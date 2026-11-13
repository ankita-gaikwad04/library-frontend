import React, { useState } from 'react';
import AdminPortal from './components/AdminPortal';
import StudentPortal from './components/StudentPortal';
import './index.css';

function App() {
  const [role, setRole] = useState('admin');

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">📚 Lib<span>Sys</span></div>
        <div className="role-toggle">
          <label>Portal View</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">👨‍💼 Admin Dashboard</option>
            <option value="student">🎓 Student Portal</option>
          </select>
        </div>
      </aside>

      <main className="main-content">
        {role === 'admin' ? <AdminPortal /> : <StudentPortal />}
      </main>
    </div>
  );
}

export default App;