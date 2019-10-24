var app = new Vue({

    el: '#app',
     data: {
         searching: true,
         deckList: new Deck(),
         searchName: 'forest',
         searchType: '',
         searchSubType: '',
         searchResults: new Deck(),
         cards: new Deck(),
         cardList: 'cardList',
         cardTypeList: [
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


     },

    methods: {

        displayCards(cardList){
            this.cardList = cardList;
            this.cards = this.searchResults;
        },
        displaySubTypes(subTypeList){
            this.subTypes = this.subTypeList;
        },


        //search for cards
        searchCards(){

            if(this.searchName) {
                this.searchResults = new Deck();

                this.searching = true;

                let queryString = '';
                //queryString += this.searchName;
                if(this.searchType !== '')
                {


                    queryString +=  ' t:' + this.searchType.slice(0, this.searchType.indexOf('-types'));
                }

                if(this.searchSubType !== '')
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
                            this.searchResults = new Deck(response.data.data);
                            console.log(url, config);



                        }
                    })
                    .catch(function (error) {
                        console.error('ajax query error', error);
                    })
                    .finally(function () {
                        this.searching = false;
                        this.displayCards()

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
                            this.subTypeList.add('');



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
        addToDeck(card) {
            this.deckList.add(card);
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
                this.getSubTypes();
            }
        }
    }

});