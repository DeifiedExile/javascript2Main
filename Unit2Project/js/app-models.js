
var Deck = function(arr){

    
    //create empty array if none provided
    if(!Array.isArray(arr)){
        arr = [];
    }
    arr.add = function(cardEntry, amount)
    {
        if(arr.contains(cardEntry))
        {
            var row = this.findCard(cardEntry);
            return arr[row].quantity += 1;
        }


        return arr.push({"card": cardEntry, quantity: amount});

    };
    arr.subtract = function(cardEntry)
    {
        if(arr.contains(cardEntry))
        {
            var row = this.findCard(cardEntry);
            if(arr[row].quantity === 1)
            {
                return arr.remove(cardEntry)
            }
            else {
                return arr[row].quantity -= 1;
            }
        }
    };
    arr.remove = function(card)
    {
        return arr.splice(arr.findCard(card), 1);
    };
    arr.contains = function(card)
    {
        return this.findCard(card) >= 0;
    };
    arr.findCard = function(card){

        return arr.findIndex(function(item){
            return item.card.id == card.id;
        });

    };

    return arr;

};
var DetailList = function()
{
    return{
        deckName: 'Deck',
        deckDescription: '',
        private: true,
        archived: false,
        needsHelp: false,
        prototype: true,
        draft: false,
        sealed: false,
        onProfile: true,
        syncInventory: false,
        noRevisions: false,
        showOther: false,
        ignoreSuggestions: false,
        publicAcquire: false,
        showCompetitive: false,
    }
}
var UserDeck = function(){
    return {
        deckList: new Deck(),
        buyList: new Deck(),
        details: new DetailList(),
        // details: function() {
        //     return {
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
        //         showCompetitive: false,
        //     }
        // }
        //
    }
};

var TypeList = function(arr){
    if(!Array.isArray(arr)){
        arr = [];
    }
    arr.add = function(type){
        return arr.push(type);
    };
    return arr;

};

var Color = function(letter, name, status){
    var abrev = letter;
    var description = name;
    var currentStatus = status;




};

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDDiuAduDFgF65wVwtZ_WPYwHrmptOYxU0",
    authDomain: "fir-demo-f169e.firebaseapp.com",
    databaseURL: "https://fir-demo-f169e.firebaseio.com",
    projectId: "fir-demo-f169e",
    storageBucket: "fir-demo-f169e.appspot.com",
    messagingSenderId: "745081264078",
    appId: "1:745081264078:web:113090b7f5193cb2a87d9f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var storage = firebase.storage();
// storage.child("decks");