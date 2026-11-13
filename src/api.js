const API_BASE = 'https://library-app-1-rsp4.onrender.com/api';

export const api = {
  getBooks: () => fetch(`${API_BASE}/books`).then(res => res.json()),
  getMembers: () => fetch(`${API_BASE}/members`).then(res => res.json()),
  getActiveIssues: () => fetch(`${API_BASE}/borrow/active`).then(res => res.json()),
  
  addBook: (book) => fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book)
  }).then(res => res.json()),
};