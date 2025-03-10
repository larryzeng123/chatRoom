// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC30oBSNFJeWJ5IYp9QOiU5e-3HHfzeUi4',
  authDomain: 'larrychatroom.firebaseapp.com',
  projectId: 'larrychatroom',
  storageBucket: 'larrychatroom.firebasestorage.app',
  messagingSenderId: '46931131470',
  appId: '1:46931131470:web:f6e8cb87a549317778971f',
  measurementId: 'G-40YNB8DB92'
};

// Initialize Firebase
export const setupFirebase = initializeApp(firebaseConfig);
