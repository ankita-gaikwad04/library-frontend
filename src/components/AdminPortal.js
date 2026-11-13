import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (activeTab === 'books' || activeTab === 'dashboard') {
      api.getBooks().then(data => Array.isArray(data) && setBooks(data));
    }
    if (activeTab === 'members' || activeTab === 'dashboard') {
      api.getMembers().then(data => Array.isArray(data) && setMembers(data));
    }
    if (activeTab === 'requests' || activeTab === 'dashboard') {
      api.getActiveIssues().then(data => Array.isArray(data) && setRequests(data));
    }
  }, [activeTab]);

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')} style={{border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: 0}}>📊 Overview</button>
        <button className={`nav-btn ${activeTab === 'books' ? 'active' : ''}`} onClick={() => setActiveTab('books')} style={{border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: 0}}>📖 Manage Books</button>
        <button className={`nav-btn ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')} style={{border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: 0}}>👥 Manage Members</button>
        <button className={`nav-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')} style={{border: '1px solid #e2e8f0', borderRadius: '12px', marginBottom: 0}}>📥 Requests</button>
      </div>

      {activeTab === 'dashboard' && (
        <div>
          <div className="page-header"><h1>Library Overview</h1><p>Real-time metrics for your library system.</p></div>
          <div className="metrics">
            <div className="metric-card"><h3>Total Books</h3><p>{books.length || 0}</p></div>
            <div className="metric-card"><h3>Registered Members</h3><p>{members.length || 0}</p></div>
            <div className="metric-card"><h3>Active Issues</h3><p>{requests.length || 0}</p></div>
          </div>
        </div>
      )}

      {activeTab === 'books' && (
        <div>
          <div className="page-header"><h1>Manage Books</h1><p>View all books in the inventory.</p></div>
          <div className="grid-container">
            {books.map(b => (
              <div key={b.book_id} className="card">
                <h4>{b.book_name}</h4>
                <p>By {b.author}</p>
                <span className="badge badge-available">Stock: {b.quantity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div>
          <div className="page-header"><h1>Manage Members</h1><p>View registered students.</p></div>
          <div className="grid-container">
            {members.map(m => (
              <div key={m.member_id} className="card">
                <h4>{m.name}</h4>
                <p>✉️ {m.email}</p>
                <p>📞 {m.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div>
          <div className="page-header"><h1>Book Requests</h1><p>Approve or reject student requests.</p></div>
          <div className="grid-container">
            {requests.length === 0 ? <p>No active requests.</p> : requests.map(r => (
              <div key={r.issue_id} className="card" style={{borderLeft: '4px solid #e67e22'}}>
                <h4>{r.book_name}</h4>
                <p>Issued to: <strong>{r.member_name}</strong></p>
                <p>Due: {new Date(r.return_date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}