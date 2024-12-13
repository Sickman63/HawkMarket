# HawkMarket

Welcome to the HawkMarket Virtual Stock Exchange Simulator! This project is designed to simulate a stock exchange environment where users can trade stocks, manage portfolios, and view leaderboards.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)

## Project Overview

HawkMarket is a web application that allows users to:
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

- **Frontend**: React, Axios
- **Backend**: Node.js, Express
- **Database**: PostgreSQL

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

## How to Update

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request.

Thank you for using HawkMarket!
```

