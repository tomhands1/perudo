import firebase from 'firebase';
import 'firebase/firestore';
import ReduxSagaFirebase from 'redux-saga-firebase';
import * as constants from '../constants';

const firebaseApp = firebase.initializeApp({
    apiKey: 'AIzaSyBX-72iuRwUEuhw_YYRwky5yVCZ8f3a7dw',
    authDomain: 'perudo-3e05b.firebaseapp.com',
    databaseURL: 'https://perudo-3e05b.firebaseio.com',
    projectId: 'perudo-3e05b',
    storageBucket: 'perudo-3e05b.appspot.com',
    messagingSenderId: '267338547483',
    appId: '1:267338547483:web:62c0ce2cd0686a5ac793be',
    measurementId: 'G-3SFQ16TWEE'
});

const rsf = new ReduxSagaFirebase(firebaseApp);
rsf.region = constants.REGION;

firebaseApp.firestore();

export { firebaseApp };
export default rsf;
