# YouTube Craft Tracker Backend

Backend API for the YouTube Craft Tracker application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/youtube-craft-tracker
NODE_ENV=development
```

3. Make sure MongoDB is running locally or update the MONGODB_URI

## Running the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

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

The Video model includes:
- Script ratings (1-5 scale)
- Sound ratings (1-5 scale)
- Experience inputs (retention, watch time, mentions)
- Automatically calculated scores (Craft, Experience, Delta)
- Experiment notes for both script and sound
