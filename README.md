# Dish Scanner

## Introduction
Dish Scanner is a React-based application that allows users to scan QR and barcodes of food items to retrieve relevant information such as calorie count, nutritional facts, and more. It simplifies tracking food intake and helps users make healthier choices.

## Project Type
Fullstack

## Deployed App
Live link: [https://cool-creponne-5792ec.netlify.app/](https://cool-creponne-5792ec.netlify.app/)
Database: MongoDB

## Directory Structure
```
my-app/
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── vite.config.js
├── node_modules/
├── src/
│   ├── components/
│   ├── context/
│   ├── qrgenerater/
│   ├── assets/
│   ├── styles/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
```

## Video Walkthrough of the Project
https://drive.google.com/file/d/1B_J9I2YM9nENiuNhTaYHo_0wEusZ0EKu/view

## Features
- Scan QR to fetch food details
- Display nutritional information
- Store scanned data using MongoDB Database
- User-friendly interface with smooth animations

## Design Decisions or Assumptions
- The app is optimized for mobile devices
- Uses MongoDB Database for storing scanned data
- Scanning functionality is implemented using a third-party library
- Minimalistic UI for better usability

## Installation & Getting Started
```bash
# Clone the repository
git clone https://github.com/Siddhesh-Kolambekar/Dish-Scanner.git
cd Dish-Scanner

# Install dependencies
npm install

# Run the website
npm run dev
```

## Usage
1. Open the application.
2. Click on the scan button.
3. Sign up and log in to start scanning.
4. Scan a food item QR code.
5. View the fetched details on the screen.

## Credentials
N/A

## APIs Used
- QR scanning library

## Technology Stack
- React.js
- MongoDB
- JavaScript (ES6+)
- HTML & CSS
- Third-party QR scanning library

