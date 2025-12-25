# QMessage Backend

Node.js/Express/Socket.io real-time messaging API.

## Setup

```bash
npm install
cp .env.example .env
npm start  # or npm run dev (with nodemon)
```

## API Endpoints

- `POST /api/signup` - Register user
- `POST /api/login` - Login user
- `GET /api/users` - Get all users
- `GET /api/health` - Health check

## WebSocket Events

- `send_message` - Send real-time message
- `receive_message` - Receive message

## Environment

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing key
- `PORT` - Server port (default 3000)

## Database

Uses MongoDB. Free tier: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Deploy

- **Railway**: Push to GitHub, auto-deploy.
- **Render**: Connect repo, select Node, auto-deploy.
- **Heroku**: `heroku create qmessage-backend && git push heroku main`
