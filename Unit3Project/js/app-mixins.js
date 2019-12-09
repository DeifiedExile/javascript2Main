//mixin containing props and methods/computed functions
//can be added to any component that needs them
//can extend other mixins
//methods overridden by component if using the same name
//events all fired if same name
const userMixin = {
    props: {
        authUser: {required: true},
    },

    computed: {
        loggedIn() {
            return (this.authUser && this.authUser.uid);
        },
    },
    methods: {
        login(){
            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth()
            // .signInWithEmailAndPassword(email, password)
                .signInWithPopup(provider)
                .catch(function(error) {
                    // Handle Errors here.
                    let errorCode = error.code;
                    let errorMessage = error.message;

                    document.getElementById('message').innerHTML =  'Error: ' + errorMessage;
                });
        },

        logout(){
            firebase.auth().signOut();

        },
    },
};