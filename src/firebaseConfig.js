import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage'; 
import 'firebase/compat/functions';

const config = {
    apiKey: "AIzaSyBUZ7DsM0EI2bdf5nIdwYI9DFbD_taP7RA",
    authDomain: "camouflage-43fe0.firebaseapp.com",
    databaseURL: "https://camouflage-43fe0.firebaseio.com",
    projectId: "camouflage-43fe0",
    storageBucket: "camouflage-43fe0.appspot.com",
    messagingSenderId: "274389819300",
    appId: "1:274389819300:web:4180ea302c30715ff96b31",
    measurementId: "G-MCVFRSVWMN"
  };

firebase.initializeApp(config);

export default firebase;