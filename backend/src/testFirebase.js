import firebaseDB from "./config/firebase.js";

const testFirebaseConnection = async () => {
  try {
    await firebaseDB.ref(".info/connected").once("value");
    console.log("Firebase Admin SDK initialized successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Firebase connection failed:", error.message);
    process.exit(1);
  }
};

testFirebaseConnection();