import React, { useState } from 'react';
import { api } from '../api';

export default function StudentPortal() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = async () => {
    try {
      // Note: Update this URL if your Render URL is different
      const res = await fetch('https://library-app-1-rsp4.onrender.com/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!res.ok) throw new Error("User not found");
      
      const userData = await res.json();
      setUser(userData);
      
      const booksData = await api.getBooks();
      if (Array.isArray(booksData)) {
        setBooks(booksData);
        setSearchResults(booksData); // Show all books initially
      }
      
    } catch (err) {
      alert("Login failed. Check your email.");
    }
  };

  // Local Search Logic (Replaces the AI API call)
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(books); // Show all if empty
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = books.filter(b => 
      b.book_name.toLowerCase().includes(lowerQuery) || 
      b.author.toLowerCase().includes(lowerQuery)
    );
    setSearchResults(filtered);
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
        <p>Browse the catalog to find your next read.</p>
      </div>

      {/* Standard Search Bar (Replaces AI UI) */}
      <div className="form-card" style={{ display: 'flex', gap: '16px' }}>
        <input 
          type="text" 
          placeholder="Search by book title or author..." 
          value={searchQuery} 
          onChange={e => handleSearch(e.target.value)} 
          style={{ marginBottom: 0 }} 
        />
      </div>

      {/* Book Grid */}
      <div className="grid-container">
        {searchResults.length > 0 ? (
          searchResults.map(b => (
            <div key={b.book_id} className="card">
              <h4>{b.book_name}</h4>
              <p>By {b.author}</p>
              <span className="badge badge-available">Available ({b.quantity})</span>
            </div>
          ))
        ) : (
          <p style={{ color: '#64748b', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            No books found matching "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
}