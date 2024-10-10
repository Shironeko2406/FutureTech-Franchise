import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVOqm2RjCokn1aAgXs85hxupmyVWNA-cQ",
  authDomain: "imageupdatedb.firebaseapp.com",
  projectId: "imageupdatedb",
  storageBucket: "imageupdatedb.appspot.com",
  messagingSenderId: "640036381047",
  appId: "1:640036381047:web:13ba29c6b5c7ba260b8172",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBDHtrSQodExWU4lev6HHkFCbU1cQ4XI-o",
//   authDomain: "futuretech-de038.firebaseapp.com",
//   projectId: "futuretech-de038",
//   storageBucket: "futuretech-de038.appspot.com",
//   messagingSenderId: "749862955406",
//   appId: "1:749862955406:web:04bd0a500a69202dc8dcdf"
// };

const app = initializeApp(firebaseConfig);
export const imageDB = getStorage(app);