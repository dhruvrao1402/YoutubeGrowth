# YouTube Craft Tracker

A full-stack application to track and analyze YouTube video quality improvements using a ratings-based system.

## Features

- **Script Ratings**: Rate hook effectiveness, structure clarity, concision, specificity, and audience bridge (1-5 scale)
- **Sound Ratings**: Rate cue alignment, silence placement, mix balance, and emotional fit (1-5 scale)
- **Experiment Tracking**: Document new techniques tried in both script and sound
- **Experience Metrics**: Track retention at 30s, average watch time, and craft mentions in comments
- **Automatic Scoring**: Calculates Craft Score, Experience Score, and Delta Score
- **Analytics Dashboard**: View trends, averages, and weekly streaks
- **Full CRUD Operations**: Create, read, update, and delete video entries

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Shadcn/ui components
- Vite build tool

### Backend
- Node.js + Express
- MongoDB + Mongoose
- RESTful API
- CORS enabled

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/youtube-craft-tracker
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup
1. In a new terminal, navigate to the root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:8080` (or next available port)

## API Endpoints

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos` - Create new video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### Analytics
- `GET /api/videos/stats/analytics` - Get analytics and statistics

## Data Model

Each video entry includes:
- **Script Ratings**: 5 criteria rated 1-5
- **Sound Ratings**: 4 criteria rated 1-5
- **Experiment Notes**: Optional notes for new techniques
- **Experience Inputs**: Audience metrics (retention, watch time, mentions)
- **Distribution Metrics**: Views and CTR (optional)
- **Calculated Scores**: Craft Score (0-100), Experience Score (0-100), Delta Score

## Scoring System

- **Craft Score**: Average of all script + sound ratings, converted to 0-100 scale
- **Experience Score**: Weighted average of retention (60%), watch time (30%), and mentions (10%)
- **Delta Score**: Experience Score - Craft Score (positive = audience engagement exceeds craft quality)

## Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon for auto-restart
```

### Frontend Development
```bash
npm run dev  # Start Vite dev server
npm run build  # Build for production
```

### Database
The application uses MongoDB. Make sure MongoDB is running locally or update the connection string in the backend `.env` file.

## Project Structure

```
├── src/                    # Frontend source
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── types/            # TypeScript type definitions
│   └── pages/            # Page components
├── backend/               # Backend source
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   └── server.js         # Main server file
└── README.md             # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License
