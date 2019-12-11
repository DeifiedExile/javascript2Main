
Vue.use(Vuefire);
Vue.use(VueResizeText);
// Vue.use(VueRouter);


const router = new VueRouter({
    routes: [
        {path: '/', component: HomePage},
        {name: 'home', path: '/home', component: HomePage},
        {name: 'myDecks', path: '/mydecks', component: MyDecksPage},
        {path: '/createDeckPage', alias: '/create', component: EmptyRouterView,
            children: [{
                name: 'createPage',
                path: '',
                component: CreateDeckPage

            },
                {
                    name: 'createTutorial',
                    path: 'tutorial',
                    components: {
                        default: CreateDeckPage,
                        tutorial: CreateTutorial
                    }
                }
            ] },
        { name: 'deck', path: '/deck/:id', component: DeckDetailPage, props: true},



    ],
});

var app = new Vue({

    el: '#app',
    router: router,
    data: {
        newUserDeck: new UserDeck(),

        authUser: null,
        decks: [],

    },


    methods: {

        purchaseAll(){
            //todo: implement link to bulk purchasing. May require purchasing api access. Skipping for now

            // let purchaseString = '';
            // this.buyList.forEach(function(item){
            //     purchaseString += item.quantity + ' ' + item.card.name + '||';
            // });
            //
            // let url = 'https://store.tcgplayer.com/massentry?partner=Scryfall&utm_campaign=affiliate&utm_medium=scryfall&utm_source=scryfall';
            // let config = {
            //     params: {
            //         c: purchaseString
            //     }
            // }
            // this.$http.get(url, config);
        }

    },
    computed: {

    },
    created: function() {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                //
                // User is signed in.
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                var providerData = user.providerData;

                console.log('Signed in as: ', user.displayName);

                app.authUser = new User(user);

            } else {
                // User is signed out.
                console.log('Not signed in.');
                app.authUser = null;

            }
        });
    },
    mounted: function () {

    },
    watch: {

    }

});