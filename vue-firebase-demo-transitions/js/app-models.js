// Recipe Model
var Recipe = function(){
    return {
        name: '',
        image: null,
        description: '',
        ingredients: [''],
        directions: [''],
        rating: 0,
    }
};


// Initialize Firebase
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDDiuAduDFgF65wVwtZ_WPYwHrmptOYxU0",
    authDomain: "fir-demo-f169e.firebaseapp.com",
    databaseURL: "https://fir-demo-f169e.firebaseio.com",
    projectId: "fir-demo-f169e",
    storageBucket: "fir-demo-f169e.appspot.com",
    messagingSenderId: "745081264078",
    appId: "1:745081264078:web:1cb489a14d65a00ca87d9f"
};


// Create references to firestore and storage
var db = firebase.firestore();
var storage = firebase.storage().ref();

