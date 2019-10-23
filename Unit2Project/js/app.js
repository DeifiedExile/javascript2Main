var app = new Vue({

    el: '#app',
     data: {
         searchName: 'forest',
         searchResults: new Deck(),
         cards: new Deck(),
         cardList: 'cardList'
     },

    methods: {

        display(cardList){
            this.cardList = cardList;
            this.cards = this.searchResults;
        },

        //search for cards
        searchCards(){

            if(this.searchName){
                this.searchResults = new Deck();
            }

            //build request
            let url = 'https://api.scryfall.com/cards/search';
            let config = {
                params: {
                    q: this.searchName
                }
            }



            //execute request
            this.$http
                .get(url, config)
                .then(function(response){
                    console.log(response);
                    if(response.data.total_cards > 0){
                        this.searchResults = new Deck(response.data.data);

                        
                    }
                })
                .catch(function(error){
                    console.error('ajax query error', error);
                })
                .finally(function(){
                    this.display()
                })
        }
    },
    computed: {

    },
    mounted: function(){

        this.searchCards();
    }

});