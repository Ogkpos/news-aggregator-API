# NEWS AGGREGATOR API

## Overview

The News Aggregator API is designed to provide users with a personalized news experience. It allows users to sign up, manage their preferences (interests, sources, and keywords), and retrieve aggregated news articles based on their preferences. Users can also save articles for later reading.

**Key Features:**

- User Registration and Authentication: Users can sign up using their email and password. The API also supports session management, Multi-factor authentication and JSON Web Tokens (JWT) for authentication.
- Preferences Management: Users can set interests, preferred news sources, and keywords for customized news aggregation.
- News Aggregation: The API fetches articles from various RSS feeds based on the user's preferences.
- Saved Articles: Users can save articles for later reading.
- Share Articles: Users can share articles amongst themselves.
- Comment Articles: Users can comment on an article
- Advanced Search: Users can perform keyword-based searches across multiple sources.

**Prerequisites:**

To run the API locally, you will need the following installed on your machine:

- Node.js (version 14 or higher)
- MongoDB (locally or a hosted instance, e.g., MongoDB Atlas)
- You also need to configure environment variables. Use the provided .env example file as a reference.

## Getting Started

**1. Clone the Repository**

```bash
git clone https://github.com/Ogkpos/news-aggregator-API.git
cd news-aggregator-api
```

**2. Install Dependencies**

```bash
npm install
```

**3. Environment Configuration**

Create a .env file in the root of the project and configure the following environment variables:

```env
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600 # in seconds

MONGO_URI=mongodb://localhost:27017/news-aggregator
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@example.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=no-reply@example.com

```

**4. Running MongoDB Locally**
Ensure MongoDB is running. If you don't have MongoDB installed, you have to install it on your computer - Create a MongoDB cluster on Atlas for FREE or run locally and provide the DATABASE_URI in the index.ts file

**5. Running the API**

```bash
npm run dev
```

This command starts the development server at http://localhost:4000.

**6. Running Tests**
To run the test suite using Jest and Supertest:

```bash
npm test
```

## FLow for personalizing feeds

    - Users provide a keyword/keywords inorder to perform keyword search
    - Overall users see aggregated news based on the news sources they provided

## API Endpoints

**1. User Authentication**

- POST /api/users/signup

  - Create a new user.

- POST /api/users/signin

  - Generate a unique OTP code for the user.

- POST /api/users/verifyotp

  - Authenticate a user by providing valid otp that was generate on signin

- GET /api/users/currentuser

  - Retrieve the current authenticated user.

- POST /api/users/signout
  - Log/sign user out of the application

**2. Preferences Management**

- PUT /api/users/updateuser/:id
  - Update the user's preferences (interests, sources, keywords).

**3. News Aggregation**

- GET /api/users/aggregated-news

  - Fetch news articles based on user preferences.

- GET /api/news/:id
  - Fetch an individual aggregated news based on the provide aggregated news id

**4. Saved Articles**

- POST /api/users/save-article

  - Save an article for later reading.

- GET /api/users/saved-articles

  - Retrieve the user's saved articles.

- DELETE /api/users/remove-saved-article/:articleId
  - User can delete a saved article

**5. Share Articles**

- POST /api/articles/share

  - Share an article with a user

- GET /api/articles/received
  - Retrieve/get article that was shared

**6. Comment Articles**

- POST /api/articles/:articleId/comments
  - Users can comment on an article
- GET /api/articles/:articleId/comments
  - Retrieve/get comments on an article

## Project Structure

```bash

├── src
│   ├──
│   ├── models         # Mongoose models for User, Article,SharedArticle, Comment
│   ├── routes         # Express routes for Logic and  API endpoints
│   ├── services       # Services for external integrations (e.g., email, RSS)
│   └── utils          # Utility functions and middlewares
├── tests              # Unit and integration tests setup
├── .env.example       # Example environment configuration
├── package.json       # Project dependencies and scripts
└── README.md          # Project documentation

```

## Future Enhancements

- Notifications and Alerts: Set breaking news and daily digest news alert
- Detailed postman API Documentation link inorder to test endpoints
- Write integration/unit tests for 80% of apps logic.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
