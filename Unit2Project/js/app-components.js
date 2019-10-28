Vue.component('card', {
    props: {
        card: {type: Object, required: true},
        deck: {type: Array, required: true},
        showqty: false,
        qty: '',
        

    },
    data: function() {
        return this.card;


    },


    computed: {
        getImgLarge(){
            return this.card.image_uris.large;
        },
        getImgReg(){
            try {
                if (this.card.layout === 'split' || this.card.layout === 'flip' || this.card.layout === 'transform' || this.card.layout === 'double_faced_token') {
                    return this.card.card_faces[0].image_uris.normal;
                } else {
                    return this.card.image_uris.normal;

                }
            }
            catch
            {
                console.log(this.card.name);
            }
          
        },
        getImgSmall(){
            return this.card.image_uris.small;
        },
        getGathererUri(){
            return this.card.related_uris.gatherer;
        },
        getPurchaseUri(){
            return this.card.purchase_uris.tcgplayer;
        }




    },

    methods: {
        addToDeck(){
            this.deck.add(this.card, 1);
        },
        removeFromDeck(){
            this.deck.subtract(this.card);
        }

    },

    template: `
            <div class="card mtgCard">
                <div class="card-header text-center">
                    <h6 class="card-title rounded " >{{card.name}}</h6>
                </div>
                <div class="card-body mtgCardBody text-center"> 
                                   
                    <img v-bind:src="this.getImgReg" class="card-img">
                    <div class="cardButtonsOverlay">
                        <div class="row text-center">
                            <div v-if="showqty == false" class="col-sm-12 btn cardAddButton text-center pt-4 px-4" @click.capture="addToDeck"><h1><i  class="fas fa-plus addIcon"></i></h1></div>
                            <div v-if="showqty == true">
                                <div class="col-sm-5 btn cardAddButton text-center pt-4 px-4" @click.capture="addToDeck"><h1><i  class="fas fa-plus addIcon"></i></h1></div>   
                                <div class="col-sm-5 btn cardAddButton text-center pt-4 px-4" @click.capture="removeFromDeck"><h1><i  class="fas fa-minus addIcon"></i></h1></div>                                
                            </div>
                            
                        </div>
                        <div class="row">
                            <div class="col-sm-5 offset-1 btn text-center "><h1><a v-bind:href="this.getGathererUri"><i class="fas fa-search"></i></a></h1></div>
                            <div class="col-sm-5 btn text-Center "><h1><a v-bind:href="this.getPurchaseUri"><i class="fas fa-shopping-cart"></i></a></h1></div>
                        </div>
                        
                        <br/>
                        
                    </div>          
                    <div v-if="showqty == true"><span>Quantity: {{qty}}</span></div>    
                    
                                       

                </div>
                <div class="card-footer">
                    
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