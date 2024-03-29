var app = new Vue({
    // el: the DOM element to be replaced with a Vue instance
    el: '#app',

    // data: all the data for the app
    data: {
        searching: true,
        searchTerm: '🐝',
        searchResults: new BookCollection(),
        books: new BookCollection(),
        bookmarks: new BookCollection(),
        favorites: new BookCollection(),
        bookshelf: 'store',
    },

    // methods: usually "events" triggered by v-on:
    methods: {
        // change "page" by setting books array
        display(bookshelf){
            this.bookshelf = bookshelf;

            switch(this.bookshelf){
                case 'store':
                    this.books = this.searchResults;
                    break;
                case 'bookmarks':
                    this.books = this.bookmarks;
                    break;
                case 'favorites':
                    this.books = this.favorites;
                    break;
            }
        },

        // LOAD BOOKS
        searchBooks() {
            // prepare and perform search
            if(this.searchTerm){
                // clear results
                this.searchResults = new BookCollection();

                // display message
                this.searching = true;

                // build request arguments

                let url = 'https://www.googleapis.com/books/v1/volumes';
                let config = {
                    params: {
                        q: this.searchTerm,
                        maxResults: 36,
                        filter: 'partial'
                    }
                }


                // execute ajax request using promises
                //$http part of vue resource
                this.$http
                    .get(url, config) //make the ajax request
                    .then(function(response){ //called on successful response ( .then(response => {} is the same as .then(function(response){}
                        console.log(response);

                        //set results array if some were found
                        if(response.data.totalItems > 0){
                            //create my 'custom' array object from the array returned
                            this.searchResults = new BookCollection(response.data.items);
                            //without custom object
                            // this.searchResults = response.data.items;
                        }
                    })
                    .catch(function(error){ //gets called when a 4xx or 5xx error is received
                        //error from bad search or lost internet connection
                        console.error('AJAX QUERY ERROR', error);
                        //TODO: let user know of error

                    })
                    .finally(function(){
                        //remove searching message
                        this.searching = false;

                        //display page
                        this.display('store');
                    }) //called regardless of success or failure



            }
        },
    },

    // computed: values that are updated and cached if dependencies change
    computed: {

    },

    //mounted:  called after the instance has been mounted,
    mounted: function() {
        // if we have a list in local storage, replace the sample data
        if (localStorage.getItem('bookmarks')){
            this.bookmarks = new BookCollection(JSON.parse(localStorage.getItem('bookmarks')));
        }

        if (localStorage.getItem('favorites')){
            this.favorites = new BookCollection(JSON.parse(localStorage.getItem('favorites')));
        }

        // perform default search
        this.searchBooks();
    },

    // watch: calls the function if the value changes
    // https://travishorn.com/add-localstorage-to-your-vue-app-in-2-lines-of-code-56eb2c9f371b
    watch: {
        bookmarks: {
            handler: function(newCollection) {
                // store in local storage for later
                localStorage.setItem('bookmarks', JSON.stringify(newCollection));
            }
        },
        favorites: {
            handler: function(newCollection) {
                // store in local storage for later
                localStorage.setItem('favorites', JSON.stringify(newCollection));
            }
        }
    }
});