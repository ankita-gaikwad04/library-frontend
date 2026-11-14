import React, { useState } from 'react';
import { api } from '../api';

export default function StudentPortal() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const API_BASE = 'https://library-app-1-rsp4.onrender.com/api';

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/members/login`, {
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

  // New search function triggered by the form submit
  const handleSearchSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    if (!searchQuery.trim()) {
      setSearchResults(books); 
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE}/books/rag-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      
      const data = await res.json();
      if (Array.isArray(data)) {
        setSearchResults(data);
      }
    } catch (err) {
      console.error("RAG search failed", err);
      alert("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Clears the search and shows all books again
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(books);
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
        <p>Use our AI-powered semantic search to find exactly what you need.</p>
      </div>

      {/* RAG Search Form */}
      <form onSubmit={handleSearchSubmit} className="form-card" style={{ display: 'flex', gap: '16px', background: 'linear-gradient(to right, #ffffff, #f8fafc)', border: '1px solid #e2e8f0' }}>
        <input 
          type="text" 
          placeholder="Try asking: 'I want to learn about object-oriented programming'..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          style={{ marginBottom: 0 }} 
        />
        <button type="submit" className="btn-primary" style={{ width: '150px', background: 'var(--accent)' }} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
        {searchQuery && (
          <button type="button" onClick={handleClearSearch} className="btn-primary" style={{ width: '100px', background: '#64748b' }}>
            Clear
          </button>
        )}
      </form>

      {isSearching && <p style={{ color: '#64748b', marginBottom: '20px' }}>🧠 Searching knowledge base...</p>}

      {/* Book Grid */}
      <div className="grid-container">
        {searchResults.length > 0 ? (
          searchResults.map(b => (
            <div key={b.book_id} className="card" style={{ borderTop: '4px solid #e67e22' }}>
              <h4>{b.book_name}</h4>
              <p>By {b.author}</p>
              
              {/* Show description if it exists */}
              {b.description && (
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '10px', fontStyle: 'italic' }}>
                  "{b.description}"
                </p>
              )}
              
              <span className="badge badge-available" style={{ marginTop: 'auto' }}>
                Available ({b.quantity})
              </span>
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