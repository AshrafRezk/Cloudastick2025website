// Configuration for Cloudastick Backend
module.exports = {
  // Gemini API Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyByyPyLqSCevZhWA4z21gdL7wxLtCYe-Fg',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  PORT: process.env.PORT || 3001,
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // Rate Limiting (basic)
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100, // requests per window
};
