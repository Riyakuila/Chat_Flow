# ChatFlow

## Description

ChatFlow is a real-time chat application built using the MERN stack (MongoDB, Express.js, React, Node.js) integrated with Socket.io for seamless instant messaging. It allows users to communicate in real-time, manage chats, and share media through a modern, responsive interface.

## Features

- **Real-time Messaging**: Instant message delivery using Socket.io
- **User Authentication**: Secure login and registration system
- **Chat Management**: Create and join chat rooms
- **Online Status**: See who's online and available for chat
- **Media Sharing**: Upload and share images via Cloudinary integration
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **State Management**: Efficient state handling with Zustand

## Tech Stack

### Frontend
- **React**: Component-based UI library
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API calls

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Socket.io**: Real-time bidirectional communication
- **MongoDB**: NoSQL database
- **JWT**: JSON Web Tokens for authentication
- **Cloudinary**: Cloud-based media management

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup
1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory and add the following environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   ```

4. Start the backend server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal).

## Usage

1. **Registration/Login**: Create an account or log in with existing credentials.
2. **Dashboard**: View your chats, online users, and recent activity.
3. **Start Chatting**: Select a user or join a chat room to begin messaging.
4. **Media Sharing**: Use the upload feature to share images in chats.
5. **Settings**: Customize your profile and app preferences.

## Available Scripts

In the frontend directory, you can run:

- `npm run dev`: Starts the development server
- `npm run build`: Builds the app for production
- `npm run preview`: Previews the production build locally
- `npm run lint`: Runs ESLint for code linting

In the backend directory, you can run:

- `npm start`: Starts the production server
- `npm run dev`: Starts the development server with nodemon

## Project Structure

```
Chat_Flow/
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── models/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── ...
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── ...
│   └── ...
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Socket.io for real-time communication
- Cloudinary for media hosting
- Tailwind CSS for styling
- MERN stack community

## Contact

For questions or support, please open an issue in this repository.