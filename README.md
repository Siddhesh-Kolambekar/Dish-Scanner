# Dish Scanner

## Introduction
Dish Scanner is a React-based application that allows users to scan QR and barcodes of food items to retrieve relevant information such as calorie count, nutritional facts, and more. It simplifies tracking food intake and helps users make healthier choices.

## Project Type
Frontend

## Deployed App
Frontend: [Deployed Link](https://cool-creponne-5792ec.netlify.app/)
Backend: N/A
Database: Firebase Realtime Database

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
[Attach a short video walkthrough showcasing the features of the application]

## Features
- Scan QR and barcodes to fetch food details
- Display nutritional information
- Store scanned data using Firebase Realtime Database
- User-friendly interface with smooth animations

## Design Decisions or Assumptions
- The app is optimized for mobile devices
- Uses Firebase Realtime Database for storing scanned data
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
- Firebase Realtime Database
- Barcode scanning library

## Technology Stack
- React.js
- Firebase Realtime Database
- JavaScript (ES6+)
- HTML & CSS
- Third-party barcode scanning library

