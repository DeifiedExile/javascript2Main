
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
    arr.cardCount = function(){
        var count = 0;
        arr.forEach(c => count += c.quantity);
        return count;
    };
    arr.getTotalCost = function(){
        var cost = 0;

        arr.forEach(function(c){
            cost += (c.card.prices.usd * c.quantity);
        });
        if(cost === 0)
        {
            cost = 9999999;
        }
        return cost;
    }
    arr.getTotalCompScore = function(){
        var score = 0;
        arr.forEach(function(c){
            if(c.card.edhrec_rank)
            {
                score += (c.card.edhrec_rank * c.quantity);
            }
            else
            {
                score += 9999;
            }

        });
        if(score === 0)
        {
            score = 99999999;
        }

        return score;
    }

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
        competitive: '',

    }
};



var UserDeck = function(){



    return {
        deckList: new Deck(),
        buyList: new Deck(),
        details: new DetailList(),
        createdBy: null,
        createDate: null,
        competitiveScore: 99999999,
        avgCost: 9999999,
        mixedScore: 99999999
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

var User = function(firebaseUser){
    let m = {
        displayName: '',
        email: '',
        photoURL: '',
        uid: '',
    }

    if(firebaseUser){
        m.displayName = firebaseUser.displayName ? firebaseUser.displayName : '';
        m.email = firebaseUser.email ? firebaseUser.email : '';
        m.photoURL = firebaseUser.photoURL ? firebaseUser.photoURL : '';
        m.uid = firebaseUser.uid ? firebaseUser.uid : '';
    }

    return m;
}
var Guest = function(){
    return {
        user: null,
        datetime: new Date(),
    }
};



// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDDiuAduDFgF65wVwtZ_WPYwHrmptOYxU0",
    authDomain: "fir-demo-f169e.firebaseapp.com",
    databaseURL: "https://fir-demo-f169e.firebaseio.com",
    projectId: "fir-demo-f169e",
    storageBucket: "fir-demo-f169e.appspot.com",
    messagingSenderId: "745081264078",
    appId: "1:745081264078:web:9d3c84f4390ba1a1a87d9f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
