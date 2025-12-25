require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/qmessage';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Message Schema (send-only model)
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipients: [{ type: String }], // Phone numbers or email addresses to send to
  content: { type: String, required: true },
  messageCount: { type: Number, default: 1 }, // How many recipients
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

// Routes
// Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username, email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Send message (broadcast to recipients)
app.post('/api/send-message', async (req, res) => {
  try {
    const { senderId, recipients, content } = req.body;
    if (!senderId || !recipients || !content) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const message = new Message({
      sender: senderId,
      recipients: recipients,
      content: content,
      messageCount: recipients.length,
      status: 'sent'
    });
    await message.save();

    io.emit('message_sent', {
      sender: senderId,
      recipients: recipients,
      content: content,
      messageCount: recipients.length,
      timestamp: new Date()
    });

    res.json({ success: true, message });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get sent messages (history)
app.get('/api/messages/:userId', async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.params.userId }).sort({ timestamp: -1 });
    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Socket.io Real-time Messaging (send-only)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send_message', async (data) => {
    try {
      const { senderId, recipients, content } = data;
      const message = new Message({
        sender: senderId,
        recipients: recipients,
        content: content,
        messageCount: recipients.length,
        status: 'sent'
      });
      await message.save();

      io.emit('message_sent', {
        sender: senderId,
        recipients: recipients,
        content: content,
        messageCount: recipients.length,
        timestamp: new Date(),
        messageId: message._id
      });
    } catch (err) {
      console.error('Message error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
