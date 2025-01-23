# Trips Web App (React)

## Project Overview

The **Trips Web App** is a full-stack application designed to help admins manage trips and allow users to join them. Admins can create, update, and delete trips, while users can sign up, view trip details, join trips. The app uses **JWT-based authentication** for secure user login and role-based access control.

---

## Purpose

- **Admins**: Create, update, and delete trips. Receive notifications from users and approve or deny joining requests.
- **Regular Users**: Sign up, update profiles, view trip details, join trips, and send requests to admins.

---

## Core Features

### User Features
- **Registration/Login**: Secure JWT-based authentication.
- **Dashboard**: View trips with details like:
  - Money needed for the trip.
  - Number of available spots.
  - Trip details (name, destination, dates, etc.).
- **Join Trips**: Users can join trips and send requests to admins.
- **Profile Management**: Update user profiles.
- **Balance Tracking**: Track owing balances for trips.
- **Requests**: Send requests to admins for joining trips and paying the required amount.

### Admin Features
- **Trip Management**: Create, update, and delete trips.
- **Notifications**: Receive notifications when:
  - A user requests to join a trip.
  - A user indicates money has been paid for the trip.
- **Request Management**: Approve or deny user requests.
- **User Participation**: View and manage the status of users' participation in trips.

---

## Tech Stack

### Frontend using Vite
- **React**: Latest stable version.
- **React Router**: For client-side routing.

### Backend
- **Node.js**: Backend runtime.
- **Express**: Backend framework.
- **MongoDB**: Database for storing trips, users, and requests.
- **JWT**: For user authentication.

### Deployment
- **Azure**: For production

### Testing
- **Jest**: For unit and integration testing.

---

## How to Run the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (or a free-tier MongoDB Atlas account)

### Setup - to be completed