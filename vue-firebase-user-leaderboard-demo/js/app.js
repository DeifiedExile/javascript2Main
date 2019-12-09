Vue.use(Vuefire);

var app = new Vue({
    el: '#app',

    data: {
        authUser: null,
        user: null,
    },

    methods: {
        createUser(email, password, firstName, lastName, school){
            firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then(function(docRef){
                    // create user object with matching id
                    // could also use email address (or anything)
                    // but id is easiest for permissions
                    db.collection('leadItUsers').doc(docRef.user.uid).set({
                        firstName: firstName,
                        lastName: lastName,
                        school: school,
                    })
                    .catch(function(error) {
                        console.error('Error creating user document', error);

                        // TODO: handle errors
                    });


                    // create leaderboard entry with matching id
                    // could also use email address (or anything)
                    // but id is easiest for permissions
                    db.collection('leadItBoard').doc(docRef.user.uid).set({
                        displayName: firstName + ' ' + lastName.substr(0,1) + '.',
                        score: 0,
                    })
                    .catch(function(error) {
                        console.error('Error creating board document', error);

                        // TODO: handle errors
                    });
                })
                .catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.error('Create User Error', error);

                    // TODO: let the user know there was an error
                });
        },

        login(email, password){
            firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .catch(function(error) {
                    // Handle Errors here.
                    let errorCode = error.code;
                    let errorMessage = error.message;
                    console.error('Login Error', error);

                    // TODO: let the user know
                });
        },

        logout(){
            firebase.auth().signOut();
        },

        addToScore(userId, score){
            // more info on transactions:
            // https://firebase.google.com/docs/firestore/manage-data/transactions#transactions
            db.runTransaction(function(transaction) {
                let docRef = db.collection('leadItBoard').doc(userId);

                // This code may get re-run multiple times if there are conflicts.
                return transaction.get(docRef).then(function(doc) {
                    if (!doc.exists) {
                        throw "Document does not exist!";
                    }

                    // Add score to existing score
                    var newScore = doc.data().score + 1;
                    transaction.update(docRef, { score: newScore });
                });
            }).then(function() {
                console.log("Score updated!");
            }).catch(function(error) {
                console.error("Transaction failed: ", error);
            });
        },

        addToMyScore(){
            this.addToScore(this.authUser.uid, 1);
        },

        // simulate different users
        // (you would never do this in a real app)
        createUser1(){this.createUser('bart@example.com', 'supersecret', 'Bart', 'Simpson', 'Springfield Elementary');},
        createUser2(){this.createUser('lisa@example.com', 'supersecret', 'Lisa', 'Simpson', 'Springfield Elementary');},
        createUser3(){this.createUser('chris@example.com', 'supersecret', 'Chris', 'Griffin', 'James Woods Regional High School');},
        createUser4(){this.createUser('meg@example.com', 'supersecret', 'Meg', 'Griffin', 'James Woods Regional High School');},

        loginUser1(){this.login('bart@example.com', 'supersecret');},
        loginUser2(){this.login('lisa@example.com', 'supersecret');},
        loginUser3(){this.login('chris@example.com', 'supersecret');},
        loginUser4(){this.login('meg@example.com', 'supersecret');},

        addToUser1(){this.addToScore('bart-dJ7CSf53Fa...', 1);},
        addToUser2(){this.addToScore('lisa-VoLvGQiZoP...', 1);},
        addToUser3(){this.addToScore('chris-1syqNPiYc...', 1);},
        addToUser4(){this.addToScore('meg-g9eBFfqQBni...', 1);},
    },

    computed: {
        loggedIn(){
            return this.authUser && this.user;
        }
    },

    created: function() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                console.info('Signed in as: ', user);

                // set Firebase User object
                this.authUser = user;

                // get/set custom user document/object
                db.collection('leadItUsers').doc(user.uid).get().then((doc) => {
                    if (doc.exists) {
                        this.user = doc.data();
                    } else {
                        console.log("No such user object");
                    }
                }).catch(function(error) {
                    console.error("Error getting user document:", error);
                });
            }else{
                console.info('Not signed in.');

                // clear objects which will update the rest of the page
                this.authUser = null;
                this.user = null;
            }
        });
    },

});

