# GIVA URL Shortener

A modern URL shortening service built with React, Express, and MongoDB.

## Live Demo

The application is deployed and available at: [https://giva-url-shorten.vercel.app/](https://giva-url-shorten.vercel.app/)

## Features

- URL shortening with custom aliases
- Click tracking and analytics
- Modern, responsive UI built with React and Tailwind CSS
- RESTful API powered by Express
- MongoDB for data storage

## Technology Stack

- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js
- **Database**: MongoDB
- **Deployment**: Vercel

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env` file
4. Run the development server: `npm run dev`

## Deployment

The application is configured for deployment on Vercel with the following settings:

- **Framework Preset**: Vite
- **Build Command**: npm run build
- **Output Directory**: dist/public
- **Environment Variables**: 
  - MONGODB_URI
  - NODE_ENV=production 