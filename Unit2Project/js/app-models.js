
var Deck = function(arr){

    //create empty array if none provided
    if(!Array.isArray(arr)){
        arr = [];
    }
    var cardMap = new Map()
    // if(!Map instanceof Map){
    //     cardMap = new Map();
    // }
     // cardMap = new Map();

    //adds card to deck
    arr.getMap = function(){
        return cardMap.entries();
    }

    arr.add = function(card, quantity){
        if(!isNaN(parseInt(quantity)))
        {
            if(arr.contains(card))
            {
                return cardMap.set(card, cardMap.get(card)+1);
            }
            else
            {
                return cardMap.set(card, quantity);
            }

        }

        //return arr.push(card);
    };
    arr.subtract = function(card){
        var foundCard = cardMap.findCard(card);
        if(cardMap.get(foundCard)-1 < 1)
        {
            cardMap.remove(foundCard);
        }
        else
        {
            cardMap.set(foundCard, cardMap.get(foundCard)-1);
        }

    };
    //removes card from deck
    arr.remove = function(card){
        //return arr.splice(arr.findCard(card), 1);
        return cardMap.delete(this.findCard(card));
    };

    arr.contains = function(card){
        return this.findCard(card) >= 0;
    };
    arr.getCards = function(){
        return Array.from(cardMap.keys());
    };

    //finds card in deck
    arr.findCard = function(card){
        return Array.from(cardMap.keys()).findIndex(function(item){
            return item.id == card.id;
        });
    };
    return arr;

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
var ColorList = function(arr){

    if(!Array.isArray(arr)){
        arr = [];
    }
    arr.add = function(color){
        return arr.push(color);
    };
    return arr;
}
var Color = function(letter, name, status){
    var abrev = letter;
    var description = name;
    var currentStatus = status;




}