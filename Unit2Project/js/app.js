var app = new Vue({

    el: '#app',
    data: {
        tabIndex: 0,
        searching: true,
        deckList: new Deck(),
        deckName: '',
        deckDescription: '',
        private: true,
        archived: false,
        needsHelp: false,
        prototype: true,
        draft: false,
        sealed: false,
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

    methods: {

        displayCards(cardList) {
            this.cardList = cardList;
            this.cards = this.searchResults.map(c => c.card);
            this.deckCardList = this.deckList.map(c => c.card);

            console.log(this.searchResults);
            console.log(this.deckList);

        },

        displaySubTypes() {
            this.subTypes = this.subTypeList;
            if (this.subTypes.length > 0) {
                console.log(this.subTypes.length);

                console.log(this.subTypeList.length);

            } else {
                console.log("none");
            }


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
                            console.log(url, config);


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
            console.log('click');
            this.deckList.add(card, 1);
            //this.deckCardList = this.deckList.getCards();
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

        }

    },
    computed: {
        nameState(){
            return this.deckName.length >= 3 
        },
        invalidNameFeedback() {
            if(this.deckName.length > 3) {
                return ''
            }
            else if (this.deckName.length > 0) {
                return 'Please enter at least 3 characters'
            }
            else {
                return 'Your deck requires a name'
            }
        },
        descriptionState(){
            return this.deckDescription.length >= 5 
        },
        invalidDescriptionFeedback() {            
            if(this.deckDescription.length > 5){
                return ''
            }
            else if (this.deckDescription.length > 0) {
                return 'Description must be at least 5 characters'
            }
            else {
                return 'Your deck needs a description'
            }
        }
    },
    mounted: function () {
        
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
            handler: function () {
                this.displayCards();
                console.log(this.deckList);
                console.log(this.searchResults);
            }
        }
    }

});