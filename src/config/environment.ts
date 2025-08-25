// Environment configuration
export const config = {
  development: {
    apiUrl: 'http://localhost:5000/api'
  },
  production: {
    apiUrl: 'https://youtube-growth-8avy-ppn8yu9u1-dhruva-raos-projects.vercel.app/api' // ⚠️ REPLACE: your-backend-name → your actual backend name
  }
};

export const getApiUrl = () => {
  const env = import.meta.env.MODE || 'development';
  return config[env as keyof typeof config]?.apiUrl || config.development.apiUrl;
};
