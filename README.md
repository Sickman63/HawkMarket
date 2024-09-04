# Virtual Stock Exchange Simulator

Welcome to the Virtual Stock Exchange Simulator project! This project is designed to simulate a stock exchange environment where users can trade stocks, manage portfolios, and view leaderboards.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Development](#development)
- [API Endpoints](#api-endpoints)
- [UI/UX Design](#uiux-design)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The Virtual Stock Exchange Simulator is a web application that allows users to:
- Register and log in to their accounts.
- View real-time stock updates.
- Manage their stock portfolios.
- Compete with others on the leaderboard.

## Features

- **User Registration and Authentication**: Secure sign-up, login, and account management.
- **Real-Time Stock Updates**: Live updates of stock prices and market trends.
- **Portfolio Management**: Track and manage stock investments.
- **Leaderboards**: Compare performance with other users.

## Tech Stack

- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Design**: Figma for UI/UX wireframes and mockups
- **Testing**: Jest, Cypress

## Setup and Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sickman63/HawkMarket
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd HawkMarket
   ```

3. **Install Dependencies**:
   - For the backend:
     ```bash
     cd backend
     npm install
     ```
   - For the frontend:
     ```bash
     cd ../frontend
     npm install
     ```

4. **Configure Environment Variables**:
   - Create a `.env` file in both the `backend` and `frontend` directories and add the necessary environment variables (refer to `.env.example`).

5. **Run the Application**:
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - Start the frontend application:
     ```bash
     cd ../frontend
     npm start
     ```

## Development

### Backend

- **Folder Structure**:
  - `src/controllers` - API controllers
  - `src/routes` - API routes
  - `src/models` - Database models
  - `src/config` - Configuration files

### Frontend

- **Folder Structure**:
  - `src/components` - React components
  - `src/pages` - Page components
  - `src/redux` - Redux actions and reducers
  - `src/styles` - Tailwind CSS configuration and styles

## API Endpoints

- **User**:
  - `POST /api/users/register` - Register a new user
  - `POST /api/users/login` - Log in a user

- **Stocks**:
  - `GET /api/stocks` - Get real-time stock data
  - `POST /api/stocks/trade` - Execute a stock trade

- **Portfolio**:
  - `GET /api/portfolio` - Get user portfolio
  - `PUT /api/portfolio` - Update user portfolio

- **Leaderboard**:
  - `GET /api/leaderboard` - Get leaderboard data

## UI/UX Design

Design wireframes and interactive mockups are created using Figma. Refer to the `Figma` folder for design assets and prototypes.

## Contributing

We welcome contributions to this project! Please follow these guidelines:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request.

Thank you for using HawkMarket!
```

