import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCpM7JtmvjWWucwBAHJBGCSwXmZUuC2buQ",
    authDomain: "reorganize.firebaseapp.com",
    projectId: "reorganize",
    storageBucket: "reorganize.appspot.com",
    messagingSenderId: "391634495514",
    appId: "1:391634495514:web:574f5323231f4b697c89a3"
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();