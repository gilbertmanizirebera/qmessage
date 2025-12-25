// QMessage Frontend Integration with Backend
// Configure this with your backend URL
const API_URL = localStorage.getItem('apiUrl') || 'http://localhost:3000';

// Initialize Socket.io connection
let socket = null;

function connectSocket() {
  if (typeof io !== 'undefined') {
    socket = io(API_URL, { reconnection: true });
    socket.on('connect', () => console.log('Connected to server'));
    socket.on('receive_message', (data) => {
      displayMessage(data);
    });
  }
}

// Auth: Signup
async function handleSignup(username, email, password) {
  try {
    const res = await fetch(`${API_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('username', data.user.username);
    connectSocket();
    return data.user;
  } catch (err) {
    console.error('Signup error:', err);
    throw err;
  }
}

// Auth: Login
async function handleLogin(email, password) {
  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id);
    localStorage.setItem('username', data.user.username);
    connectSocket();
    return data.user;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

// Get all users
async function getUsers() {
  try {
    const res = await fetch(`${API_URL}/api/users`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
}

// Send message
function sendMessage(recipientId, content) {
  if (!socket) connectSocket();
  const senderId = localStorage.getItem('userId');
  socket.emit('send_message', { senderId, recipientId, content });
}

// Display received message
function displayMessage(data) {
  const messagesDiv = document.getElementById('messages');
  if (!messagesDiv) return;

  const msgEl = document.createElement('div');
  msgEl.className = 'message ' + (data.sender === localStorage.getItem('userId') ? 'sent' : 'received');
  msgEl.innerHTML = `
    <strong>${data.sender === localStorage.getItem('userId') ? 'You' : 'User'}:</strong>
    <p>${escapeHtml(data.content)}</p>
    <small>${new Date(data.timestamp).toLocaleTimeString()}</small>
  `;
  messagesDiv.appendChild(msgEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Logout
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  if (socket) socket.disconnect();
  window.location.reload();
}

// Utility: Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Export for use in index.html
window.QMessage = { handleSignup, handleLogin, handleLogout, getUsers, sendMessage, connectSocket };
