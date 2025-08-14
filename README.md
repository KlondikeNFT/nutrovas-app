# AI SupplementAdvisor

An AI-powered supplement recommendation system designed specifically for athletes and fitness enthusiasts. The platform provides personalized supplement suggestions based on individual profiles, sports participation, and health considerations.

## Features

- **Modern, Responsive Design**: Mobile-first approach with beautiful UI/UX
- **Comprehensive User Profiles**: Collect detailed information about users including sports, allergies, and health data
- **Secure Authentication**: Password hashing and validation
- **SQLite Database**: Lightweight, file-based database for easy deployment
- **RESTful API**: Clean backend architecture ready for AI integration
- **TypeScript Support**: Full type safety for the frontend

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Responsive design for mobile and desktop

### Backend
- Node.js with Express
- SQLite database
- bcryptjs for password hashing
- express-validator for input validation
- CORS enabled for cross-origin requests

## Project Structure

```
health/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── App.tsx        # Main app component
│   │   └── index.tsx      # Entry point
│   ├── package.json       # Frontend dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   └── postcss.config.js  # PostCSS configuration
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   └── package.json       # Backend dependencies
├── package.json            # Root package.json
└── README.md              # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health
   ```

2. **Quick Start (Recommended)**
   ```bash
   ./start.sh
   ```
   
   This script will check prerequisites, install dependencies, and start both servers.

3. **Install all dependencies**
   ```bash
   npm run install-all
   ```

   Or install manually:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   cd ..
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend (port 3001) and frontend (port 3000) servers concurrently.

### Manual Setup

If you prefer to run servers separately:

**Backend (Terminal 1):**
```bash
cd server
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd client
npm start
```

## Usage

### Frontend
- **Landing Page**: Visit `http://localhost:3000` to see the main landing page
- **Sign Up**: Navigate to `http://localhost:3000/signup` to create a new account
- **Responsive Design**: The site automatically adjusts for mobile and desktop views

### Backend API
- **Health Check**: `GET http://localhost:3001/api/health`
- **User Signup**: `POST http://localhost:3001/api/auth/signup`
- **Get User Profile**: `GET http://localhost:3001/api/users/:id`

## Database Schema

The application uses SQLite with the following user table structure:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  dateOfBirth TEXT NOT NULL,
  sports TEXT NOT NULL,      -- JSON array of sports
  allergies TEXT NOT NULL,   -- JSON array of allergies
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## User Profile Fields

The signup form collects the following information:

- **Username**: Unique identifier (min 3 characters)
- **Email**: Valid email address
- **Password**: Secure password (min 8 characters)
- **First Name**: User's first name
- **Last Name**: User's last name
- **Date of Birth**: Age calculation and validation
- **Sports**: Multi-select from 25+ sports options
- **Allergies**: Multi-select from common dietary restrictions

## Development

### Available Scripts

**Root level:**
- `npm run dev`: Start both frontend and backend in development mode
- `npm run install-all`: Install dependencies for all packages

**Frontend (client/):**
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests

**Backend (server/):**
- `npm run dev`: Start with nodemon (auto-restart on changes)
- `npm start`: Start production server

### Code Style

- **Frontend**: TypeScript with React functional components and hooks
- **Backend**: ES6+ JavaScript with Express middleware pattern
- **Styling**: Tailwind CSS utility classes with custom component styles
- **Database**: SQLite with prepared statements for security

## Security Features

- Password hashing with bcryptjs (12 salt rounds)
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- CORS configuration for API security
- Unique constraints on username and email

## Mobile Responsiveness

The application is built with a mobile-first approach:
- Responsive grid layouts
- Touch-friendly form controls
- Optimized spacing for mobile devices
- Flexible navigation for small screens

## Future Enhancements

This foundation is ready for:
- **AI Integration**: Add machine learning models for supplement recommendations
- **User Dashboard**: Personalized supplement tracking and history
- **Supplement Database**: Comprehensive supplement information and reviews
- **Progress Tracking**: Fitness goals and supplement effectiveness monitoring
- **Social Features**: Community sharing and recommendations

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 5000 are available
2. **Database errors**: Check that the server has write permissions in the server directory
3. **CORS issues**: Verify the backend is running on port 5000
4. **Build errors**: Clear node_modules and reinstall dependencies

### Getting Help

- Check the console for error messages
- Verify all dependencies are installed correctly
- Ensure Node.js version is compatible (v16+)

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This is a foundation application. The AI supplement recommendation functionality will be added in future iterations.
