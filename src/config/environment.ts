// Environment configuration
export const config = {
  development: {
    apiUrl: 'http://localhost:5000/api'
  },
  production: {
    apiUrl: 'https://REPLACE_WITH_YOUR_BACKEND_URL.vercel.app/api' // ⚠️ REPLACE: your-backend-name → your actual backend name
  }
};

export const getApiUrl = () => {
  const env = import.meta.env.MODE || 'development';
  return config[env as keyof typeof config]?.apiUrl || config.development.apiUrl;
};
