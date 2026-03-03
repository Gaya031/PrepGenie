# 🎯 PrepGenie - AI-Powered Interview Preparation Platform

<p align="center">
  <img src="https://img.shields.io/badge/Stack-MERN-blue" alt="MERN Stack">
  <img src="https://img.shields.io/badge/AI-Groq_LLM-green" alt="Groq LLM">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</p>

An intelligent full-stack web application that helps job seekers prepare for interviews by analyzing their resumes and job descriptions to generate personalized interview strategies, practice questions, skill gap analysis, and AI-tailored resumes.

---

## ✨ Features

### 🔍 Resume & Job Description Analysis
- Parse PDF resumes using advanced text extraction
- Analyze job descriptions to identify key requirements
- Calculate match scores (0-100) between candidate profile and job requirements

### 📝 AI-Generated Interview Reports
- **Technical Questions**: 10+ relevant technical questions based on job description
- **Behavioral Questions**: 10+ STAR-method behavioral questions
- **Skill Gap Analysis**: Identify areas needing improvement with severity levels
- **Preparation Plan**: Day-wise study plan tailored to individual needs

### 📄 AI-Powered Resume Generator
- Automatically generate ATS-optimized resumes
- Tailor resume content to match specific job descriptions
- Export professional resumes as PDF

### 🔐 Authentication & Security
- JWT-based authentication with secure cookie storage
- Password encryption using bcrypt
- Protected routes and API endpoints
- MongoDB database for secure data storage

### 📊 User Dashboard
- View all generated interview reports
- Track interview preparation progress
- Access previous reports anytime

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| React Router | Client-side routing |
| Axios | HTTP Client |
| SCSS | Styling |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |

### AI & Services
| Technology | Purpose |
|------------|---------|
| Groq SDK | LLM for interview report generation |
| Puppeteer | PDF generation |
| pdf-parse | Resume text extraction |
| Zod | Schema validation |

---

## 📁 Project Structure

```
PrepGenie/
├── Backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── api_v1.js          # API v1 router
│   │   │   └── routes/
│   │   │       ├── auth.routes.js    # Authentication routes
│   │   │       └── interview.routes.js # Interview routes
│   │   ├── config/
│   │   │   └── db.js             # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Auth logic
│   │   │   └── interview.controller.js # Interview logic
│   │   ├── middlewares/
│   │   │   ├── auth.middlewares.js   # JWT verification
│   │   │   └── file.middleware.js    # File upload handling
│   │   ├── models/
│   │   │   ├── user.model.js     # User schema
│   │   │   ├── blackList.model.js # Token blacklist
│   │   │   └── interview_report.model.js # Report schema
│   │   ├── services/
│   │   │   └── ai.service.js    # AI integration
│   │   ├── app.js               # Express app setup
│   │   └── server.js            # Server entry
│   ├── package.json
│   └── .env                     # Environment variables
│
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/  # Auth components
│   │   │   │   ├── pages/       # Login, Register
│   │   │   │   ├── hooks/       # useAuth hook
│   │   │   │   ├── services/    # Auth API calls
│   │   │   │   └── auth.context.jsx # Auth context
│   │   │   └── interview/
│   │   │       ├── pages/       # Home, Interview
│   │   │       ├── hooks/       # useInterview hook
│   │   │       ├── services/    # Interview API
│   │   │       └── style/       # Interview styles
│   │   ├── style/               # Global styles
│   │   ├── App.jsx              # Root component
│   │   ├── app.routes.jsx       # Route definitions
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PrepGenie
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   ```

3. **Create backend .env file**
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/interview_ai
   JWT_SECRET=your_super_secret_jwt_key
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Setup Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd Backend
   npm start
   # Server runs on http://localhost:3000
   ```

2. **Start Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

---

## � API Endpoints

### Authentication Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/logout` | User logout |
| GET | `/api/auth/get-me` | Get current user |

### Interview Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview` | Generate interview report |
| GET | `/api/interview` | Get all user reports |
| GET | `/api/interview/report/:id` | Get specific report |
| POST | `/api/interview/resume/pdf/:id` | Generate resume PDF |

---

## 🎯 How It Works

### 1. User Registration/Login
Create an account or login to access the platform securely.

### 2. Upload Resume or Enter Profile
- Upload your PDF resume, OR
- Enter a self-description of your skills and experience

### 3. Provide Job Description
Paste the job description you're targeting.

### 4. Generate Interview Report
The AI analyzes:
- Your resume/profile
- Job requirements
- Identifies skill gaps

### 5. Receive Comprehensive Report
Get:
- Match score (0-100%)
- Technical questions with answers
- Behavioral questions with answers
- Skill gaps with severity
- Day-wise preparation plan

### 6. Generate Tailored Resume
Get an ATS-optimized resume tailored to the job description.

---

## 📸 Screenshots

### Home Page
- Clean, modern UI for entering job description and profile
- Drag & drop resume upload
- Real-time character counter

### Interview Report
- Match score visualization
- Technical & behavioral questions
- Skill gap analysis with severity indicators
- Personalized preparation plan

---

## 🔧 Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 3000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT |
| GROQ_API_KEY | API key for Groq LLM |

---

## 🛡️ Security Features

- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- Protected API routes with middleware
- Input validation with Zod
- CORS configuration
- Token blacklist for logout

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for AI capabilities
- [MongoDB](https://www.mongodb.com/) for database
- [React](https://react.dev/) for the frontend
- [Express](https://expressjs.com/) for the backend

---

<p align="center">Made with ❤️ for job seekers worldwide</p>

