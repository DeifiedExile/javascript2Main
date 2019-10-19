var app = new Vue({

    el: '#app',
     data: {

        searchName: 'goblin',
        searchResults: new Deck(),
     },

    methods: {
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
                    if(response.data.totalItems > 0){
                        this.searchResults = new BookCollection(response.data.data);
                    }
                })
                .catch(function(error){
                    console.error('ajax query error', error);
                })
        }
    }

});