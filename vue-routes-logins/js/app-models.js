// Models
var User = function(firebaseUser){
    let m = {
        displayName: '',
        email: '',
        photoURL: '',
        uid: '',
    }

    if(firebaseUser){
        m.displayName = firebaseUser.displayName ? firebaseUser.displayName : '';
        m.email = firebaseUser.email ? firebaseUser.email : '';
        m.photoURL = firebaseUser.photoURL ? firebaseUser.photoURL : '';
        m.uid = firebaseUser.uid ? firebaseUser.uid : '';
    }

    return m;
}

var Need = function(){
    return {
        name: '',
        datetime: new Date(),
        createdBy: null,
        assignedTo: null,
    }
};

var Potluck = function(){
    return {
        name: '',
        datetime: new Date(),
        description: '',
        location: '',
        createdBy: null,
        users: []
    }
};

var Guest = function(){
    return {
        user: null,
        datetime: new Date(),
    }
};

// -----------------------------------------------------
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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// var config = { ... };




var db = firebase.firestore();
//var storage = firebase.storage().ref();


