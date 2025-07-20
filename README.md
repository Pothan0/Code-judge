# Online Judge Platform

A comprehensive online judge platform that allows users to solve programming problems in C++, Java, and Python with real-time compilation and execution.

## Features

### 🚀 Core Features
- **Multi-language Support**: C++, Java, and Python compilation and execution
- **Real-time Code Execution**: Instant feedback on code compilation and execution
- **Problem Management**: Browse, filter, and solve programming problems
- **Submission Tracking**: Track all your submissions with detailed results
- **Test Case Validation**: Automatic validation against hidden test cases
- **User Authentication**: Secure user registration and login system

### 💻 Code Editor Features
- **Monaco Editor**: Professional code editor with syntax highlighting
- **Language Toggle**: Easy switching between C++, Java, and Python
- **Code Templates**: Pre-filled code templates for each language
- **Custom Input Testing**: Test your code with custom inputs before submission

### 📊 Problem Features
- **Difficulty Levels**: Easy, Medium, and Hard problems
- **Tag System**: Problems categorized by algorithms and data structures
- **Detailed Descriptions**: Comprehensive problem statements with examples
- **Sample I/O**: Sample inputs and outputs for better understanding
- **Statistics**: View acceptance rates and submission counts

### 🎯 Submission System
- **Instant Processing**: Fast compilation and execution of code
- **Detailed Results**: Get comprehensive feedback on your submissions
- **Status Tracking**: Real-time status updates (Pending, Accepted, Wrong Answer, etc.)
- **Execution Metrics**: View execution time and memory usage
- **Error Messages**: Detailed error information for debugging

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Child Process** for code execution
- **File System** operations for temporary file management

### Frontend
- **React 19** with functional components and hooks
- **React Router DOM** for client-side routing
- **Monaco Editor** for code editing
- **Tailwind CSS** for responsive styling
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Vite** for fast development and building

### Compiler Support
- **C++**: GCC with C++17 standard
- **Java**: JDK 11+ with automatic class detection
- **Python**: Python 3.x interpreter

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- GCC compiler (for C++)
- Java JDK (for Java)
- Python 3.x (for Python)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd auth-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   ```

4. Seed the database with sample problems:
   ```bash
   node seed.js
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd auth-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile (protected)

### Problems
- `GET /api/problems` - Get all problems with filtering
- `GET /api/problems/:id` - Get specific problem
- `POST /api/problems` - Create new problem (admin only)
- `PUT /api/problems/:id` - Update problem (admin only)
- `DELETE /api/problems/:id` - Delete problem (admin only)
- `GET /api/problems/stats` - Get problem statistics

### Submissions
- `POST /api/submissions` - Submit solution
- `POST /api/submissions/test` - Test code without submission
- `GET /api/submissions/:id` - Get submission details
- `GET /api/submissions/user/:userId` - Get user's submissions
- `GET /api/submissions/problem/:problemId` - Get problem submissions (admin)
- `GET /api/submissions/stats` - Get submission statistics

## Usage Guide

### For Students/Programmers

1. **Register/Login**: Create an account or login to existing account
2. **Browse Problems**: Navigate to the problems page to see available challenges
3. **Filter Problems**: Use difficulty and tag filters to find suitable problems
4. **Solve Problems**: Click on a problem to view details and start coding
5. **Choose Language**: Select your preferred programming language (C++/Java/Python)
6. **Write Code**: Use the Monaco editor to write your solution
7. **Test Code**: Use custom input to test your code before submission
8. **Submit Solution**: Submit your code for evaluation
9. **View Results**: Check your submission status and results
10. **Track Progress**: View all your submissions in the submissions page

### For Administrators

1. **Login as Admin**: Use admin credentials to access admin features
2. **Create Problems**: Add new programming problems with test cases
3. **Manage Problems**: Edit or delete existing problems
4. **Monitor Submissions**: View all submissions for problems
5. **Review Statistics**: Access platform-wide statistics

## Default Admin Account

After running the seed script, you can login as admin using:
- **Email**: admin@onlinejudge.com
- **Password**: admin123

## Code Execution Security

The platform implements several security measures:

1. **Process Isolation**: Each code execution runs in a separate process
2. **Time Limits**: Configurable execution time limits to prevent infinite loops
3. **Memory Limits**: Memory usage restrictions (future enhancement)
4. **Temporary Files**: Automatic cleanup of temporary compilation files
5. **Input Sanitization**: Proper validation of user inputs

## Sample Problems

The platform comes with 5 pre-configured problems:

1. **Two Sum** (Easy) - Hash table problem
2. **Reverse Integer** (Medium) - Math problem
3. **Valid Parentheses** (Easy) - Stack problem
4. **Longest Common Subsequence** (Hard) - Dynamic programming
5. **Fibonacci Number** (Easy) - Math/DP/Recursion

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/new-feature`)
6. Create a Pull Request

## Future Enhancements

- [ ] Docker containers for safer code execution
- [ ] Memory usage monitoring
- [ ] Contest system with time-based competitions
- [ ] Plagiarism detection
- [ ] Discussion forums for problems
- [ ] Editorial solutions
- [ ] Rating system for users
- [ ] More programming languages (C#, Go, Rust)
- [ ] Code sharing and collaboration features
- [ ] Mobile responsive improvements

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email your questions or create an issue in the repository.

## Acknowledgments

- MongoDB for the database solution
- Monaco Editor for the code editing experience
- The open-source community for various packages and tools used
