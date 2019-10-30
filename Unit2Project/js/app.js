Vue.use(Vuefire);
// TODO: Implement firestore
var app = new Vue({

    el: '#app',
    data: {
        decks: [],
        userDeck: new UserDeck(),
        tabIndex: 0,
        deckTabIndex: 0,
        searching: true,
        deckList: new Deck(),
        buyList: new Deck(),
        deckDetails: new DetailList(),
        // deckDetails: [
        //     {
        //         deckName: '',
        //         deckDescription: '',
        //         private: true,
        //         archived: false,
        //         needsHelp: false,
        //         prototype: true,
        //         draft: false,
        //         sealed: false,
        //         onProfile: true,
        //         syncInventory: false,
        //         noRevisions: false,
        //         showOther: false,
        //         ignoreSuggestions: false,
        //         publicAcquire: false,
        //         showCompetitive: false,}
        // ],

        deckCardList: [],
        searchName: '',
        searchType: null,
        searchSubType: null,
        searchResults: new Deck(),
        cards: [],
        cardList: 'cardList',
        cardTypeList: [
            {value: null, text: '-Select a type-'},
            {value: 'artifact-types', text: 'artifact'},
            {value: "", text: 'conspiracy'},
            {value: 'creature-types', text: 'creature'},
            {value: 'enchantment-types', text: 'enchantment'},
            {value: 'spell-types', text: 'instant'},
            {value: 'land-types', text: 'land'},
            {value: "", text: 'phenomenon'},
            {value: "", text: 'plane'},
            {value: "planeswalker-types", text: 'planeswalker'},
            {value: "", text: 'scheme'},
            {value: "spell-types", text: 'sorcery'},
            {value: "", text: 'tribal'},
            {value: "", text: 'vanguard'}

        ],
        subTypeList: new TypeList(),
        subTypes: new TypeList(),
        colors: [
            {name: 'White', status: 1, letter: 'w'},
            {name: 'Blue', status: 0, letter: 'u'},
            {name: 'Black', status: 0, letter: 'b'},
            {name: 'Red', status: 0, letter: 'r'},
            {name: 'Green', status: 0, letter: 'g'},
            {name: 'Colorless', status: 0, letter: 'c'},

        ],

        logicOptions: ['NOT', 'AND', 'OR']


    },
    firestore: {
        decks: db.collection('decks'),
        
    },

    methods: {
        //final update to deck object. insurance for firebase storage
        updateDeck(){
          this.userDeck.details = this.deckDetails;
          this.userDeck.deckList = this.deckList;
          this.userDeck.buyList = this.buyList;
        },
        //stores deck to firebase
        storeDeck(){
            this.updateDeck();
            let theDeck = this.userDeck;
            let theDeckList = this.userDeck.deckList;
            
            let theDetails = this.userDeck.details;
            

            db.collection('decks')
                .add(theDeck)
                .then((docRef) =>{
                    console.log("deck added: ", docRef);
                    // this.storeDeckList(docRef.id);
                    // this.storeBuyList(docRef.id);
                    // this.storeDetails(docRef.id);
                }).catch((error)=> {
                    console.log("error adding record", error)
            });
        },
        //stores deck list to firebase
        // storeDeckList(docId){
        //    
        //     if(!docId || !this.userDeck.deckList)
        //     {
        //         return false;
        //     }
        //     let theDeck = this.userDeck;
        //    
        //     storage.child('decks').child(docId)
        //         .put(theDeck.deckList)
        //       
        //         .catch((error) => {
        //             console.log("Error uploading file: ", error);
        //         });
        //    
        //    
        // },
        // //stores buyli
        // storeBuyList(docId){
        //    
        //     if(!docId || !this.userDeck.buyList)
        //     {
        //         return false;
        //     }
        //     let theDeck = this.userDeck;
        //    
        //     storage.child('decks').child(docId)
        //         .put(theDeck.buyList)
        //         // .then((snapshot) => {
        //         //     console.log('uploaded BuyList: ', snapshot);
        //         //
        //         //     snapshot.ref.getDownloadURL().then((url) => {
        //         //         db.collection('decks').doc(docId).update({buyList: url});
        //         //     })
        //         //
        //         // })
        //         .catch((error) => {
        //             console.log("Error uploading file: ", error);
        //         });
        // },
        // storeDetails(docId){
        //     if(!docId || !this.userDeck.details)
        //     {
        //         return false;
        //     }
        //     let theDeck = this.userDeck.details;
        //    
        //     storage.child('decks').child(docId)
        //         .put(theDeck.details)
        //         // .then((snapshot) => {
        //         //     console.log('uploaded details: ', snapshot);
        //         //
        //         //     snapshot.ref.getDownloadURL().then((url) => {
        //         //         db.collection('decks').doc(docId).update({details: url});
        //         //     })
        //         //
        //         // })
        //         .catch((error) => {
        //             console.log("Error uploading file: ", error);
        //         });
        // },
        testname(){
            this.userDeck.details = this.deckDetails;
            
            console.log(this.deckDetails.deckName);
            
        },

        displayCards(cardList) {
            this.cardList = cardList;
            this.cards = this.searchResults.map(c => c.card);
            this.deckCardList = this.deckList.map(c => c.card);


        },

        displaySubTypes() {
            this.subTypes = this.subTypeList;

            $('.subTypeSelect').css({
                minWidth: $('#typeSelect').width()
            });
        },


        //search for cards
        searchCards() {

            if (this.searchName != null) {
                this.searchResults = new Deck();

                this.searching = true;

                let queryString = '';
                let queryTypes = '';
                //queryString += this.searchName;
                if (this.searchType !== '' && this.searchType !== null) {
                    if (this.searchType.includes('-types')) {
                        queryTypes += ' t:' + this.searchType.slice(0, this.searchType.indexOf('-types'));
                    } else {
                        queryTypes += ' t:' + this.searchType;
                    }
                }
                
                if (this.searchSubType !== '' && this.searchSubType !== null) {
                    queryTypes += ' t:' + this.searchSubType;
                }
                
                
                let notColors = '';
                let andColors = '';
                let orColors = '';
                this.colors.forEach(function(color){
                    if(color.status === 0)
                    {
                        // notColors += color.letter;
                        notColors += ' c!='+ color.letter ;
                    }
                    else if (color.status === 1)
                    {
                        andColors += color.letter;
                    }
                    if(color.status === 2)
                    {
                        orColors += ' or c:' + color.letter;
                    }
                });
                queryString += queryTypes + ' ((c:' + andColors + notColors + ')' + orColors + ')';
                

                //build request
                let url = 'https://api.scryfall.com/cards/search';
                let config = {
                    params: {
                        q: this.searchName + queryString,

                    }


                }


                //execute request
                this.$http
                    .get(url, config)
                    .then(function (response) {
                        console.log(response);
                        if (response.data.total_cards > 0) {
                            // this.searchResults = new Deck(response.data.data);
                            var items = response.data.data;
                            for (let i = 0; i < items.length; i++) {

                                this.searchResults.add(items[i], 1);
                            }
                            // items.foreach(card => {
                            //     this.searchResults.add(card, 1);
                            // });



                        }
                    })
                    .catch(function (error) {
                        console.error('ajax query error', error);
                    })
                    .finally(function () {
                        this.searching = false;
                        this.displayCards();

                    })
            }
        },
        getSubTypes() {
            if (this.searchType) {

                this.subTypeList = new TypeList();


                let url = 'https://api.scryfall.com/catalog/';
                url += this.searchType;

                this.$http
                    .get(url)
                    .then(function (response) {

                        if (response.data.total_values > 0) {


                            this.subTypeList = new TypeList(response.data.data);
                            this.subTypeList.add({value: null, text: '-Select a subtype-'});


                            //response.data.data.forEach(st => this.cardSubTypes.push(st));

                        }
                    })
                    .catch(function (error) {
                        console.error('ajax query error', error);
                    })
                    .finally(function () {
                        this.displaySubTypes();
                    })
            }

        },
        addToDeck(card) {
 
            this.deckList.add(card, 1);
            //this.deckCardList = this.deckList.getCards();
            this.displayCards();
        },
        addToBuyList(){
            this.deckList.add(card, 1);
            this.buyList.add(card,1);
            this.displayCards();
        },
        changeColorOption(color) {
            if (color.status < 2) {
                color.status += 1;
            } else {
                color.status = 0;
            }
            if(this.colors[5].status === 1)
            {
                for(let i = 0; i < 5; i++)
                {
                    this.colors[i].status = 0;
                }
            }

        },
        purchaseAll(){
            let purchaseString = '';
            this.buyList.forEach(function(item){
                purchaseString += item.quantity + ' ' + item.card.name + '||';
            });
            
            let url = 'https://www.tcgplayer.com/massentry';
            let config = {
                params: {
                    c: purchaseString
                }
            }            
        }

    },
    computed: {
        nameState(){
            if(this.deckDetails.deckName != null) {
                return this.deckDetails.deckName.length >= 3
            }
            else
            {
                return false;
            }

        },
        invalidNameFeedback() {

            if(this.deckDetails.deckName != null) {
                if (this.deckDetails.deckName.length > 3) {
                    return ''
                } else if (this.deckDetails.deckName.length > 0) {
                    return 'Please enter at least 3 characters'
                }
                else {
                    return 'Your deck requires a name'
                }
            }
            else {
                return 'Your deck requires a name'
            }
        },
        descriptionState(){
            if(this.deckDetails.deckDescription != null) {
                return this.deckDetails.deckDescription.length >= 5
            }
            else
            {
                return false;
            }
        },
        invalidDescriptionFeedback() {
            if(this.deckDetails.deckDescription != null) {
                if (this.deckDetails.deckDescription.length > 5) {
                    return ''
                } else if (this.deckDetails.deckDescription.length > 0) {
                    return 'Description must be at least 5 characters'
                } else {
                    return 'Your deck needs a description'
                }
            }
            else
            {
                return 'Your deck needs a description'
            }
        },

    },
    mounted: function () {
        this.$root.$on('bv::modal::hidden', function(){
            
                $('#overlay').css("display", "block");
            
        });
        
        // if(localStorage.getItem('userdeck')){
        //
        //     this.userDeck = new UserDeck(JSON.parse(LocalStorage.getItem('userdeck')));
        //     this.buyList = this.userDeck.buyList;
        //     this.deckList = this.userDeck.deckList;
        //     this.deckDetails.deckName = this.userDeck.details.deckName;
        //     this.deckDetails.description = this.userDeck.details.description;
        //     this.deckDetails.private = this.userDeck.details.private;
        //     this.deckDetails.archived = this.userDeck.details.archived;
        //     this.deckDetails.needsHelp = this.userDeck.details.needsHelp;
        //     this.deckDetails.prototype = this.userDeck.details.prototype;
        //     this.deckDetails.draft = this.userDeck.details.draft;
        //     this.deckDetails.sealed = this.userDeck.details.sealed;
        //     this.deckDetails.onProfile = this.userDeck.details.onProfile;
        //     this.deckDetails.syncInventory = this.userDeck.details.syncInventory;
        //     this.deckDetails.noRevisions = this.userDeck.details.noRevisions;
        //     this.deckDetails.showOther = this.userDeck.details.showOther;
        //     this.deckDetails.ignoreSuggestions = this.userDeck.details.ignoreSuggestions;
        //     this.deckDetails.publicAcquire = this.userDeck.details.publicAcquire;
        //     this.deckDetails.showCompetitive = this.userDeck.details.showCompetitive;
        //
        // }
        this.searchCards();
        
    },
    watch: {
        searchType: {
            handler: function () {
                this.subTypeList = new TypeList();

                this.getSubTypes();
            }
        },
        deckList: {
            handler: function (newDeck) {
               this.displayCards();
               this.userDeck.deckList = this.deckList;
              // localStorage.setItem('userdeck', JSON.stringify(newDeck));
            }
        },
        buyList: {
            handler: function(newDeck){
                this.displayCards();
                this.userDeck.buyList = this.buyList;
               // localStorage.setItem('userdeck', JSON.stringify(newDeck));
            }
        },
        deckDetails: {
            handler: function(newDeck){
                this.userDeck.details = this.deckDetails;
                console.log("deckDetails" + this.deckDetails);
                console.log("userdeckdetails" + this.userDeck.details);
                //localStorage.setItem('userdeck', JSON.stringify(newDeck));
            }
        },

        userDeck: {
            handler: function(newDeck){
                localStorage.setItem('userdeck', JSON.stringify(newDeck));

            }
        },
        deep: true,
        
    }

});