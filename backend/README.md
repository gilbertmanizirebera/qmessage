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

### Docker / Generic

You can build and run locally with Docker:

```bash
docker build -t qmessage-backend ./
docker run -e MONGO_URI="<your-uri>" -e JWT_SECRET=secret -p 3000:3000 qmessage-backend
```

### Render (recommended)

1. Create an account at https://render.com
2. New → Web Service → Connect your GitHub repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables (`MONGO_URI`, `JWT_SECRET`)

#### Optional: GitHub Action to deploy to Render

Create repository secrets `RENDER_SERVICE_ID` and `RENDER_API_KEY`, then use the provided workflow template `.github/workflows/deploy-backend-render.yml`.

### Railway

1. Sign in to https://railway.app and create a new project
2. Connect your GitHub repo and select `qmessage`
3. Add a MongoDB plugin or set `MONGO_URI` in environment

