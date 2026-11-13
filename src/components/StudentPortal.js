import React, { useState } from 'react';
import { api } from '../api';

export default function StudentPortal() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [aiQuery, setAiQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch('https://library-app-1-rsp4.onrender.com/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) throw new Error("User not found");
      
      const userData = await res.json();
      setUser(userData);
      const booksData = await api.getBooks();
      if (Array.isArray(booksData)) setBooks(booksData);
      
    } catch (err) {
      alert("Login failed. Check your email.");
    }
  };

  const handleAiSearch = async () => {
    if (!aiQuery) return;
    setLoading(true);
    try {
      const res = await fetch('https://library-app-1-rsp4.onrender.com/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiQuery })
      });
      const data = await res.json();
      
      const keywords = data.keywords.toLowerCase().split(' ');
      const filtered = books.filter(b => {
        const text = `${b.book_name} ${b.author}`.toLowerCase();
        return keywords.some(k => text.includes(k));
      });
      setSearchResults(filtered);
    } catch (err) {
      alert("AI Search failed. Wait 60 seconds and try again.");
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '400px', margin: '80px auto', textAlign: 'center' }}>
        <div className="page-header"><h1>Student Login</h1><p>Enter your email to access the portal.</p></div>
        <div className="form-card">
          <input type="email" placeholder="Enter your email..." value={email} onChange={e => setEmail(e.target.value)} />
          <button className="btn-primary" onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Welcome, {user.name} 👋</h1>
        <p>Browse the catalog or use our Gemini AI to find exactly what you need.</p>
      </div>

      <div className="form-card" style={{ display: 'flex', gap: '16px', background: 'linear-gradient(to right, #ffffff, #fff7ed)', border: '1px solid #fed7aa' }}>
        <input type="text" placeholder="Ask AI: 'I want a book about programming'" value={aiQuery} onChange={e => setAiQuery(e.target.value)} style={{ marginBottom: 0 }} />
        <button className="btn-primary" style={{ width: '200px', background: 'linear-gradient(to right, #e67e22, #d35400)' }} onClick={handleAiSearch} disabled={loading}>
          {loading ? '✨ Thinking...' : '✨ AI Search'}
        </button>
      </div>

      <div className="grid-container">
        {(searchResults.length > 0 ? searchResults : books).map(b => (
          <div key={b.book_id} className="card">
            <h4>{b.book_name}</h4>
            <p>By {b.author}</p>
            <span className="badge badge-available">Available ({b.quantity})</span>
          </div>
        ))}
      </div>
    </div>
  );
}