# Simple Smart House Application

A modern web application for managing and controlling smart home devices with a user-friendly interface.

![Smart House App](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📺 Demo Video
[Watch the demo video here](https://www.youtube.com/watch?v=GRkmuSbIB3A)

## 🚀 Features

- **Device Management**: Add, edit, and remove smart devices
- **Real-time Control**: Control your smart devices through an intuitive interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean and user-friendly interface
- **Secure Backend**: Protected API endpoints and database connections

## 🛠️ Tech Stack

### Frontend
- Vite.js
- HTML5
- SCSS
- Bootstrap
- JavaScript

### Backend
- Node.js
- Express js
- MongoDB (cloud)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/safwen5ds/Simple_SmartHouse_APP.git
cd Simple_SmartHouse_APP
```

2. Install client dependencies
```bash
cd client
npm install
```

3. Install server dependencies
```bash
cd ../server
npm install
```

4. Configure environment variables
- Copy `config.env.example` to `config.env` in the server directory
- Update the configuration values as needed

## 🚀 Running the Application

1. Start the server
```bash
cd server
npm start
```

2. Start the client
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
Simple_SmartHouse_APP/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── js/
│   │   ├── scss/
│   │   └── *.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── db/
│   │   └── connection.js
│   └── config.env
└── README.md
```

## 👥 Authors

- Safwen Gharbi
