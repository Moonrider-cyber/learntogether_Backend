// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.FireBaseApiKey,
  authDomain: process.env.FireBaseAuthDomain,
  project: process.env.FireBaseProjectId,
  storageket:process.env.FireBaseStorageBucket,
  messagiende: process.env.FireBasemessagingSenderId, 
  appId: process.env.FireBaseappId,
  measurementId:process.env.FireBaseMeasurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);