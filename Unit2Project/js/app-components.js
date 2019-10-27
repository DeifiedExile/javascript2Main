Vue.component('card', {
    props: {
        card: {type: Object, required: true},
        deck: {type: Array, required: true}

    },
    data: function() {
        return this.card;


    },


    computed: {
        getImgLarge(){
            return this.card.image_uris.large;
        },
        getImgReg(){
          return this.card.image_uris.normal;
        },
        getImgSmall(){
            return this.card.image_uris.small;
        },
        getGathererUri(){
            return this.card.related_uris.gatherer;
        }



    },

    methods: {
        addToDeck(){

            this.$emit('addCard', [this.card, 1]);
            this.deck.add(this.card, 1);
            //this.deck.add(this.card, 1);



            // this.$emit('addToDeck', this.card);
            //this.deck.add(this.card, 1);

            // this.deck.add(this.card);
        }
        // removeFromDeck(){
        //     this.deck.subtract(this.card);
        // }
    },

    template: `
            <div class="card mtgCard">
                <div class="card-header text-center">
                    <h6 class="card-title rounded " >{{card.name}}</h6>
                </div>
                <div class="card-body mtgCardBody text-center"> 
                                   
                    <img v-bind:src="this.getImgReg" class="card-img">
                    <div class="cardButtonsOverlay">
                        <div class="row btn cardAddButton text-center pt-4 px-4" @click.capture="deck.add(card)"><h1><i  class="fas fa-plus addIcon"></i></h1></div>
                        <br/>
                        <div class="row btn text-center px-4"><h1><a v-bind:href="this.getGathererUri"><i class="fas fa-search"></i></a></h1></div>
                    </div>                                 
<!--                    <p class="card-text info col-6 offset-3"> Quantity: {{card.qty}} </p>-->
<!--                    <button class="btn btn-tiny" @click="add(card)"><i class="fas fa-plus-circle"></i></button>-->
<!--                    <button class="btn btn-tiny" @click="subtract(card)"><i class="fas fa-minus-circle"></i></button>-->
                </div>
            </div>
    `

});
Vue.component('color', {
    props:{
        //color: {type: Object, required: true},

    },
    data: function(){
        return this.color;
    },
    methods: {
        changeColorOption(){
            this.$emit(this.color);
        }
    },
    template:`
            <div class="colorButton">
                <button type="button" class="btn btn-sm btn-secodary" @click="this.change">{{color.options[statusOptions]}}</button>
                {{color.text}}
            </div>
            
    
    `


});