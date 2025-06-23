# LMS Client (React + Vite)

This is the frontend for the LMS project, built with React and Vite.

## Features

- User authentication
- Course subscription with Razorpay
- Responsive UI
- Responsive GUI

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```

## Deployment

This project can be easily deployed to [Vercel](https://vercel.com/) 

## Environment Variables

- No environment variables are required for the frontend unless you use custom APIs.

## License

MIT


# LMS Server (Node.js + Express)

This is the backend for the LMS project, built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Course management (create, update, delete)
- Payment integration with Razorpay (subscriptions)
- Admin and user roles
- Email notifications

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in the root of `lmsServer` with the required environment variables (see below).
3. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

Copy and edit this template as your `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=1d

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_EMAIL=your_from_email

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_PLAN_ID=your_razorpay_plan_id

FRONTEND_URL=http://localhost:3000
CONTACT_US_EMAIL=your_contact_email
```

## Scripts

- `npm run dev` — Start server with nodemon
- `npm start` — Start server

## License

