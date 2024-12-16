# Influencer Management Web Application

**Live Demo**: [Influencer Management App](https://influencer-management-up08.onrender.com/)

---

## Overview

The **Influencer Management Application** is a full-stack web application designed to manage influencers, their social media accounts, and assigned managers. It meets all technical and domain requirements and offers a clean, responsive user interface with enhanced error handling and additional functionality.

---

## Features

### Core Requirements (as per Technical Assignment):

- **Create a New Influencer**
    - Add first name and last name (up to 50 characters).
    - Add multiple Instagram or TikTok usernames.
    - Prevent duplicate social media accounts for a single influencer.
- **List Influencers**
    - Display first name, last name, social media accounts, and manager details.
    - Assign or unassign an employee as the manager for an influencer.
    - Filter influencers by name or assigned manager.
- **API-Based Filtering**
    - Records are filtered via backend API.

### Additional Features:

1. **Delete Influencers**: Added functionality to delete influencers.
2. **Loading States**: Custom loader with the company logo for improved UX.
3. **Simulated Employee Data**: Pre-seeded employees for manager assignment.
4. **Responsive Design**: Fully responsive layout for mobile and desktop devices.
5. **Error Handling**: Consistent error handling for API calls and form validations.
6. **Reusable Components**: All UI components (e.g., buttons, inputs, selectors, modals) are modular and reusable.
7. **Testing**:
    - Frontend: Tested with **Jest** and **@testing-library/react**.
    - Backend: Tested with **Pytest**.
8. **Deployment**: Production-ready deployment hosted on [Render](https://render.com/).

---

## Technologies Used

### Frontend:

- **React**: Core library for building UI components.
- **TypeScript**: Strongly typed JavaScript for better code quality.
- **React Router**: For client-side routing.
- **Jest & Testing Library**: Unit testing and integration testing for React components.
- **Prettier**: Code formatting for clean and readable code.

### Backend:

- **Python & FastAPI**: Fast backend REST API framework.
- **SQLAlchemy**: ORM for database interactions.
- **Alembic**: Database migrations.
- **Pytest**: Testing the backend API endpoints.
- **CORS Middleware**: Cross-Origin Resource Sharing setup.
- **Uvicorn**: ASGI server for running the FastAPI app.

### Database:

- **MySQL**: Relational database for storing influencer and employee data.

### Deployment:

- **Docker**: Containerized application setup.
- **Railway**: Hosting for production deployment.

---

## Installation & Setup

Follow these steps to run the project locally or build it for production:

### Prerequisites:

- **Node.js** (v18+)
- **Python** (v3.9+)
- **MySQL** (Database instance)
- **Docker** (optional, for containerized setup)

### 1. Clone the Repository

```bash
git clone https://github.com/your-repository/influencer-management.git
cd influencer-management
```

### 2. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up the database:
    - Create a MySQL database.
    - Update the `DATABASE_URL` in `backend/.env`:
      ```bash
      DATABASE_URL="mysql+mysqlconnector://username:password@localhost/influencer_management"
      ```
4. Run database migrations:
   ```bash
   alembic upgrade head
   ```
5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   Backend will be available at: `http://127.0.0.1:8000`

### 3. Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   Frontend will be available at: `http://localhost:3000`

### 4. Run with Docker (Optional)

To run both frontend and backend in a Docker container:

```bash
docker build -t influencer-management .
docker run -p 8000:8000 influencer-management
```

---

## Testing

### Backend Tests:

```bash
cd backend
pytest
```

### Frontend Tests:

```bash
cd frontend
npm test
```

---

## Deployment

The project is deployed to **Railway** and accessible via this URL:
[https://influencer-management-up08.onrender.com/](https://influencer-management-up08.onrender.com/)

### Steps to Deploy (Dockerized):

1. Push the code to your repository.
2. Connect the repository to **Railway**.
3. Add the environment variables (e.g., `DATABASE_URL`).
4. Redeploy the project.

---

## Screenshots

- **Create Influencer Page**
- **Influencer List Page with Filtering**
- **Responsive Design for Mobile**

(Include relevant screenshots here.)

---

## Conclusion

This project demonstrates a robust full-stack application with clear separation of concerns, responsive UI/UX, and production-ready deployment. Additional features like error handling, reusable components, and testing ensure high-quality code and usability.

---

**Live Demo**: [https://influencer-management-up08.onrender.com/](https://influencer-management-up08.onrender.com/)

Feel free to contribute or provide feedback!

