var app = new Vue({

    el: '#app',
     data: {
         searching: true,
         deckList: new Deck(),
         deckCardList: [],
         searchName: 'forest',
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
             {value: "planeswalker-types", text:  'planeswalker'},
             {value: "", text: 'scheme'},
             {value: "spell-types", text: 'sorcery'},
             {value: "", text: 'tribal'},
             {value: "", text:  'vanguard'}

             ],
         subTypeList: new TypeList(),
         subTypes: new TypeList(),
         colors: [
             {name: 'White', status: 0},
             {name: 'Blue', status: 0},
             {name: 'Black', status: 0},
             {name: 'Red', status: 0},
             {name: 'Green', status: 0},
             {name: 'Colorless', status: 0},

         ],

         colorList: [new Color('w', 'White', 0),
                    new Color('u', 'Blue', 0),
                    new Color('b', 'Black', 0),
                    new Color('r', 'Red', 0),
                    new Color('g', 'Green', 0),
                    new Color('c', 'Colorless', 0)]

         ,
         logicOptions: ['NOT', 'AND', 'OR']


     },

    methods: {

        displayCards(cardList){
            this.cardList = cardList;
            this.cards = this.searchResults.getCards();
            this.deckCardList = this.deckList.getCards();
            console.log(this.cards);
        },

        displaySubTypes(){
            this.subTypes = this.subTypeList;
            if(this.subTypes.length > 0)
            {
                console.log(this.subTypes.length);

                console.log(this.subTypeList.length);

            }
            else
            {
                console.log("none");
            }


            $('.subTypeSelect').css({
                minWidth: $('#typeSelect').width()
            });
        },


        //search for cards
        searchCards(){

            if(this.searchName) {
                this.searchResults = new Deck();

                this.searching = true;

                let queryString = '';
                //queryString += this.searchName;
                if(this.searchType !== '' && this.searchType !== null)
                {
                    if(this.searchType.includes('-types'))
                    {
                        queryString +=  ' t:' + this.searchType.slice(0, this.searchType.indexOf('-types'));
                    }
                    else
                    {
                        queryString +=  ' t:' + this.searchType;
                    }



                }

                if(this.searchSubType !== '' && this.searchSubType !== null)
                {
                    queryString += ' t:' + this.searchSubType;
                }




                //build request
                let url = 'https://api.scryfall.com/cards/search';
                let config = {
                    params: {
                        q: this.searchName + queryString,




                        //     (if(this.searchType.length > 0)
                        //     [this.cardTypeList[this.searchType].text
                        // }, this.searchSubType]

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
                            for(let i = 0; i < items.length; i++)
                            {

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
        getSubTypes(){
            if(this.searchType){

                this.subTypeList = new TypeList();


                let url = 'https://api.scryfall.com/catalog/';
                url += this.searchType;

                this.$http
                    .get(url)
                    .then(function(response){

                        if(response.data.total_values > 0){


                            this.subTypeList = new TypeList(response.data.data);
                            this.subTypeList.add({value: null, text: '-Select a subtype-'});



                            //response.data.data.forEach(st => this.cardSubTypes.push(st));

                        }
                    })
                    .catch(function (error){
                        console.error('ajax query error', error);
                    })
                    .finally(function(){
                        this.displaySubTypes();
                    })
            }

        },
        addToDeck(addCard, card) {
            console.log('click');
            this.deckList.add(card, 1);
            this.deckCardList = this.deckList.getCards();
            this.displayCards();
        },
        changeColorOption(color){
            if(color.status < 2)
            {
                color.status += 1;
            }
            else
            {
                color.status = 0;
            }

        }

    },
    computed: {

    },
    mounted: function(){

        this.searchCards();
    },
    watch: {
        searchType: {
            handler: function(){
                this.subTypeList = new TypeList();

                this.getSubTypes();
            }
        },
        deckCardList: {
            handler: function(){
                console.log(this.deckCardList);
            }
        }
    }

});