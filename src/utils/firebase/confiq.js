
import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAfvz9lL6JEl-U_IYeawYMrwjUgHhdKU_g",
  authDomain: "quickwork-bdc12.firebaseapp.com",
  projectId: "quickwork-bdc12",
  storageBucket: "quickwork-bdc12.appspot.com",
  messagingSenderId: "637341611101",
  appId: "1:637341611101:web:69fd1435482894b5c489b4",
  measurementId: "G-5VMQ9J7CL3"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {
    auth , 
    provider
}