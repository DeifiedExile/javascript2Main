Vue.component('card', {
    props: {
        card: {type: Object, required: true},
        deck: {type: Object, required: true},
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
        }

    },

    methods: {
        addToDeck(){
            this.deck.add(this.card);
        },
        removeFromDeck(){
            this.deck.subtract(this.card);
        }
    },

    template: `
            <div class="card mtgCard">
                <div class="card-header">
                    <h4 class="card-title rounded col-md-auto" >{{this.card.name}}</h4>
                </div>
                <div class="card-body mtgCardBody">                    
                    <img src="getImgReg" @click="addToDeck" class="card-img">
                    <p class="card-text info col-6 offset-3"> Quantity: {{card.qty}} </p>
                    <button class="btn btn-tiny" @click="add(card)"><i class="fas fa-plus-circle"></i></button>
                    <button class="btn btn-tiny" @click="subtract(card)"><i class="fas fa-minus-circle"></i></button>
                </div>
            </div>
    `

});
