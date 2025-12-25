# QMessage - Full Stack Platform

Real-time messaging app with user authentication and live chat.

## Architecture

- **Frontend**: HTML/CSS/JS + Socket.io (GitHub Pages)
- **Backend**: Node.js/Express + Socket.io (Railway/Render)
- **Database**: MongoDB (MongoDB Atlas free tier)
- **Auth**: JWT + bcrypt

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI and JWT secret
npm start
```

### 2. Frontend Setup (Local Testing)

Open `index.html` in a browser. Configure API URL in browser console:
```javascript
localStorage.setItem('apiUrl', 'http://localhost:3000');
```

## Deploy

### Backend (Free Options)

#### Railway
1. Push repo to GitHub
2. Go to [railway.app](https://railway.app)
3. New Project → GitHub Repo → Select `qmessage`
4. Add MongoDB (Railway has free tier)
5. Deploy

#### Render
1. Push repo to GitHub
2. Go to [render.com](https://render.com)
3. New Web Service → GitHub Repo
4. Build: `npm install`
5. Start: `npm start`
6. Add MongoDB Atlas connection

#### Heroku (paid but has free option alternatives)
```bash
heroku create qmessage-backend
git push heroku main
```

### Database (MongoDB)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (512MB)
3. Get connection string
4. Set in backend `.env` as `MONGO_URI`

### Frontend (GitHub Pages)

Already deployed: https://gilbertmanizirebera.github.io/qmessage/

After backend is live, update frontend API URL in `api.js`:
```javascript
const API_URL = 'https://your-backend-url.com';
```

## API Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/signup` | `{username, email, password}` | `{token, user}` |
| POST | `/api/login` | `{email, password}` | `{token, user}` |
| GET | `/api/users` | — | `[{id, username, email}]` |
| GET | `/api/health` | — | `{status: ok}` |

## WebSocket Events

| Event | Payload | Direction |
|-------|---------|-----------|
| `send_message` | `{senderId, recipientId, content}` | Client → Server |
| `receive_message` | `{sender, recipient, content, timestamp}` | Server → Client |

## Features

- [x] User signup/login with JWT
- [x] Real-time messaging via Socket.io
- [x] Message storage in MongoDB
- [x] User list
- [x] Responsive UI
- [ ] Group chats (future)
- [ ] File uploads (future)
- [ ] Typing indicators (future)

## Environment Variables

```
PORT=3000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/qmessage
JWT_SECRET=your_secret_key
NODE_ENV=production
```

## Next Steps

1. Deploy backend to Railway/Render
2. Update `api.js` with backend URL
3. Update `index.html` to add signup/login forms that call `QMessage.handleSignup()` and `QMessage.handleLogin()`
4. Test real-time messaging

## Support

See `backend/README.md` for backend-specific docs.
