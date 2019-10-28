
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
    }
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
function UserDeck(){
    
    this.deckList= new Deck();
    this.buyList = new Deck();
    this.details =  [{deckName: '', description: ''}];

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




}