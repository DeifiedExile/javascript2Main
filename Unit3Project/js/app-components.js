Vue.component('card', {
    props: {
        card: {type: Object, required: true},
        userDeck: {type: Object, required: true},
        //buylist: {type: Array, required: true},
        showqty: false,
        qty: '',
        editable: true
    },
    data: function () {
        return this.card;
    },
    computed: {
        getImgLarge() {
            return this.card.image_uris.large;
        },
        getImgReg() {
            try {
                if (this.card.layout === 'split' || this.card.layout === 'flip' || this.card.layout === 'transform' || this.card.layout === 'double_faced_token') {
                    return this.card.card_faces[0].image_uris.normal;
                } else {
                    return this.card.image_uris.normal;
                }
            } catch {
                console.log(this.card.name);
            }
        },
        getImgSmall() {
            return this.card.image_uris.small;
        },
        getGathererUri() {
            return this.card.related_uris.gatherer;
        },
        getPurchaseUri() {
            return this.card.purchase_uris.tcgplayer;
        }
    },

    methods: {
        addToDeck() {
            this.userDeck.deckList.add(this.card, 1);
        },
        removeFromDeck() {
            this.userDeck.deckList.subtract(this.card);
        },
        addToBuyList() {
            this.userDeck.deckList.add(this.card, 1);
            this.userDeck.buyList.add(this.card, 1);
        }
    },

    template: `
            <div class="card mtgCard">
                <div class="card-header text-center">
                    <h6 class="card-title rounded " >{{card.name}}</h6>
                </div>
                <div class="card-body mtgCardBody text-center">                                    
                    <img v-bind:src="this.getImgReg" class="card-img">
                    <div  class="cardButtonsOverlay">
                        <div class="row text-center">
                            <div v-if="showqty == false && editable" class="col-sm-12 btn cardButton cardAddButton btnAdd text-center pt-4 px-4" @click.capture="addToDeck()"><h1><a><i  class="fas fa-plus cardBtn"></i></a></h1></div>                            
                            <div v-if="showqty == true">
                                <div v-if="editable" class="col-sm-5 btn cardButton btnAdd text-center pt-4 px-3" @click.capture="addToDeck()"><h1><i  class="fas fa-plus cardBtn"></i></h1></div>
                                <div v-if="editable" class="col-sm-5 btn cardButton btnMinus text-center pt-4 px-4" @click.capture="removeFromDeck()"><h1><i  class="fas fa-minus cardBtn"></i></h1></div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-4 btn text-center"><h3><a class="inspectBtn" v-bind:href="this.getGathererUri"><i class="fas fa-search cardBtn"></i></a></h3></div>
                            <div class="col-sm-4 btn text-center"><h3><a class="buyBtn" v-bind:href="this.getPurchaseUri"><i class="fas fa-search-dollar cardBtn"></i></a></h3></div>
                            <div v-if="editable" class="col-sm-4 btn cardButton buyListBtn text-center" @click.capture="addToBuyList"><h3><i class="fas fa-file-invoice-dollar cardBtn"></i></h3></div>
                        </div>
                        <br/>
                    </div>        
                    <b-row>
                        <b-col>
                            <span>$ {{card.prices.usd}}</span>
                        </b-col>
                    </b-row>  
                    <div v-if="showqty == true"><span>Quantity: {{qty}}</span></div>    
                </div>
                <div class="card-footer">
                </div>
            </div>
    `
});
Vue.component('navigation', {
    mixins: [userMixin],
    template: `
        <ul class="list-unstyled components list-group list-group-horizontal">
            <li class="list-group-item list-group-item-dark "><router-link to="/home"  >Home</router-link></li>
            <li v-if="authUser" class="list-group-item list-group-item-dark"><router-link to="/mydecks">My Decks</router-link></li>
            <li v-if="authUser" class="list-group-item list-group-item-dark"><router-link to="/create">Create Deck</router-link></li>
            <li v-if="authUser" class="list-group-item list-group-item-dark"><a href="#" @click.prevent="logout">Logout</a></li>
            <li v-else class="list-group-item list-group-item-dark"><a href="#" @click.prevent="login">Login</a></li>
        </ul>
    `,
});
Vue.component('loading', {
    template: `
       <div>Loading...</div>
    `,
});
Vue.component('deckList', {

    props: {

        collection: {type: String},
        // user: {type: Object},
    },
    data: function () {
        return {
            decks: null,
        };
    },
    firestore: function () {
        switch (this.collection) {
            case 'competitive':
                return {
                    decks: db.collection('decks2').orderBy("competitiveScore").limit(10),
                };
            case 'budget':
                return {
                    decks: db.collection('decks2').orderBy("avgCost").limit(10)
                };
            case 'mixed':
                return {
                    decks: db.collection('decks2').orderBy("mixedScore").limit(10)
                };
            case 'user':
                return {
                    decks: db.collection('decks2').where('createdBy.uid', '==', app.authUser.uid),

                };
            default:
                return {
                    decks: db.collection('decks2'),
                };
        }
    },
    computed: {},
    methods: {},
    template: `
        <div class="deck-list col-md-4 border rounded">
        
            <div class="row text-center">
                <div class="col-12 text-center">
                    <h4 v-if="collection === 'budget'" class="text-light">Top Budget Decks</h4>
                    <h4 v-else-if="collection === 'competitive'" class="text-light">Top Competitive Decks</h4>
                    <h4 v-else-if="collection === 'mixed'" class="text-light">Top Efficient Decks</h4>
                </div>            
            </div>
            <table class="table table-dark table-striped">
                <tr>
                    <th>User</th>
                    <th>Deck Name</th>
                    <th v-if="collection === 'budget'">Budget Score</th>
                    <th v-if="collection === 'competitive'">Competitive Score</th>
                    <th v-if="collection === 'mixed'">Efficiency Score</th>
                    <th>Date Created</th>
                </tr>
                <deck v-if="decks" v-for="deck in decks" :key="deck.id" :deck="deck" :collection="collection"></deck>
                <loading v-else></loading>
            </table>
            
            
        </div>
    `
});
Vue.component('deck', {
    props: {
        deck: {type: Object, required: true},
        collection: {type: String, required: true}
    },
    template: `
        
            <tr>
                <td>{{deck.createdBy.displayName}}</td>
                <td><router-link :to="{ name: 'deck', params: { id: deck.id }}">{{deck.details.deckName}}</router-link></td>
                <td v-if="collection === 'budget'">{{deck.avgCost}}</td>
                <td v-if="collection === 'competitive'">{{deck.competitiveScore}}</td>
                <td v-if="collection === 'mixed'">{{deck.mixedScore}}</td>
                <td>{{deck.createDate.toDate().toLocaleDateString("en-US")}}</td>
            </tr>
        
    `
});
Vue.component('deckDetail', {
    mixins: [userMixin],
    props: {
        userDeck: {type: Object, required: true},

    },
    data: function(){
        return {
            deckTabIndex: 0
        }
    },
    methods: {
        deleteDeck(){
            if (confirm('Are you sure?'))
            {
                db.collection('decks2')
                    .doc(this.userDeck.id)
                    .delete().then(function() {
                    console.log("Document successfully deleted!");
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
                router.push('/home');
            }

        }
    },
    computed: {
        isOwner(){
            return this.userDeck.createdBy.uid == this.authUser.uid;
        }
    },

    template: `
        <div>
        
        
            <b-row v-if="isOwner">
                <b-col sm="12" class="text-center">
                    <b-form @submit.prevent="deleteDeck">
                        <b-button type="submit" class="btn btn-danger" >Delete</b-button>
                    </b-form>
                    
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="10" offset="1">
                    <b-row>
                        <b-tabs v-model="deckTabIndex" justified>
                            <b-tab v-bind:title="userDeck.details.deckName"  >
                                <b-container class="cardList">
                                    
                                    <b-row v-if="userDeck.deckList.length > 0">
        
        <!--                                                <card v-for="card in newUserDeck.deckList" :key="card.card.id" :card="card.card" :deck="newUserDeck.deckList" :buylist="newUserDeck.buyList" :showqty="false" ></card>-->
                                        <card v-for="card in userDeck.deckList" :key="card.card.id" :card="card.card" :user-deck="userDeck" :showqty="true" :qty="card.quantity" :editable="false"></card>
                                        
                                    </b-row>
                                    <b-row v-else class="justify-content-sm-center">
                                        <b-col sm="10">
                                            <b-alert show variant="danger">{{userDeck.deckList.length}} cards in deck. Add some cards. </b-alert>
                                        </b-col>
                                    </b-row>
                                </b-container>
                            </b-tab>
                            <b-tab title="Buylist">
                                <b-container class="cardList">
                                    
                                    <b-row v-if="userDeck.buyList.length > 0">
        <!--                                                <card v-for="card in newUserDeck.buyList" :key="card.card.id" :card="card.card" :deck="newUserDeck.deckList" :buylist="newUserDeck.buyList" :showqty="true" :qty="card.quantity"></card>-->
                                        <card v-for="card in userDeck.buyList" :key="card.card.id" :card="card.card" :user-deck="userDeck" :showqty="true" :qty="card.quantity" :editable="false"></card>
                                        
                                    </b-row>
                                    <b-row v-else class="justify-content-sm-center">
                                        <b-alert show variant="danger">{{userDeck.buyList.length}} cards in buy list.</b-alert>
                                    </b-row>
                                </b-container>
                                <b-container>
        <!--                                            <b-button @click="purchaseAll">Purchase All</b-button>-->
                                </b-container>
        
                            </b-tab>
                        </b-tabs>
        
                    </b-row>
                </b-col>
            </b-row>
        </div>
        
    `
})




