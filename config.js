import * as firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBCtO74KZBYBQR5XymeACZJKd_4QL_pVO8",
    authDomain: "school-database-3e28b.firebaseapp.com",
    databaseURL: "https://school-database-3e28b.firebaseio.com",
    projectId: "school-database-3e28b",
    storageBucket: "school-database-3e28b.appspot.com",
    messagingSenderId: "826561038716",
    appId: "1:826561038716:web:e2b3a987f4ef329411bcf9",
    measurementId: "G-YZZFYN63XG",
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase.firestore();