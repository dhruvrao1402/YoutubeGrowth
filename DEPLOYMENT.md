# Deployment Guide

## Backend Deployment (Vercel)

Your backend is configured to deploy to Vercel. The `vercel.json` file is already set up correctly.

## Frontend Deployment

### 1. Update Backend URL

Before deploying your frontend, you need to update the backend URL in `src/config/environment.ts`:

```typescript
export const config = {
  development: {
    apiUrl: 'http://localhost:5000/api'
  },
  production: {
    apiUrl: 'https://YOUR_ACTUAL_BACKEND_URL.vercel.app/api' // Replace this!
  }
};
```

### 2. Get Your Backend URL

After deploying your backend to Vercel, you'll get a URL like:
- `https://your-project-name.vercel.app`

### 3. Update the Configuration

Replace `YOUR_ACTUAL_BACKEND_URL` with your actual backend URL (without the `https://` and `.vercel.app` parts).

### 4. Deploy Frontend

Deploy your frontend to your preferred platform (Vercel, Netlify, etc.).

## Common Issues

1. **CORS Errors**: Your backend already has CORS enabled
2. **API Not Found**: Make sure the backend URL is correct
3. **Environment Variables**: The frontend will automatically use the correct URL based on the build mode

## Testing

- **Development**: Uses `localhost:5000`
- **Production**: Uses your deployed backend URL
