// QMessage Frontend Integration with Backend (Send-Only Model)
// Configure this with your backend URL
const API_URL = localStorage.getItem('apiUrl') || 'http://localhost:3000';

// Initialize Socket.io connection
let socket = null;

function connectSocket() {
  if (typeof io !== 'undefined') {
    socket = io(API_URL, { reconnection: true });
    socket.on('connect', () => console.log('Connected to server'));
    socket.on('message_sent', (data) => {
      displayMessageSent(data);
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

// Send message to multiple recipients
async function sendMessage(recipients, content) {
  if (!socket) connectSocket();
  const senderId = localStorage.getItem('userId');
  
  try {
    const res = await fetch(`${API_URL}/api/send-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, recipients, content })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    socket.emit('send_message', { senderId, recipients, content });
    return data.message;
  } catch (err) {
    console.error('Send message error:', err);
    throw err;
  }
}

// Get sent message history
async function getMessageHistory() {
  try {
    const userId = localStorage.getItem('userId');
    const res = await fetch(`${API_URL}/api/messages/${userId}`);
    return await res.json();
  } catch (err) {
    console.error('Error fetching history:', err);
    return [];
  }
}

// Display sent message confirmation
function displayMessageSent(data) {
  const historyDiv = document.getElementById('sentMessages');
  if (!historyDiv) return;

  const msgEl = document.createElement('div');
  msgEl.className = 'sent-message';
  msgEl.innerHTML = `
    <strong>Message sent to ${data.messageCount} recipient(s)</strong>
    <p>${escapeHtml(data.content)}</p>
    <small>${new Date(data.timestamp).toLocaleTimeString()}</small>
  `;
  historyDiv.appendChild(msgEl);
  historyDiv.scrollTop = historyDiv.scrollHeight;
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
window.QMessage = { handleSignup, handleLogin, handleLogout, sendMessage, getMessageHistory, connectSocket };
