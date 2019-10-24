
var Deck = function(arr){

    //create empty array if none provided
    if(!Array.isArray(arr)){
        arr = [];
    }

    //adds card to deck
    arr.add = function(card){
        return arr.push(card);
    };
    //removes card from deck
    arr.remove = function(card){
        return arr.splice(arr.findCard(card), 1);
    };

    arr.contains = function(card){
        return this.findCard(card) >= 0;
    };


    //finds card in deck
    arr.findCard = function(card){
        return arr.findIndex(function(item){
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