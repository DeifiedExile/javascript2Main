Vue.component('mtg-card-list', {
    props: {
        name: {
            type: String,
            default: 'Card'
        },
        cards: {
            type: Array,
            required: true
        }
    },

    methods: {
        add: function (card) {
            card.qty++;
        },

        subtract(card) {
            card.qty--;
            if (card.qty === 0) {
                //emit event to be caught by parent component or app
                this.$emit('remove-card', card);
            }
        }
    },

    template: `
<div class="cardListDisplay col-lg-12">
    
    <ul class="list-group list-inline list-group-flush col-lg-12 row">
        <div class="row" v-for="i in Math.ceil(cards.length / 4)">
                <li v-for="(card, i) in cards.slice((i - 1) * 4, i * 4)" :key="card.name" class="list-group-item col-md-3 text-center">
                    <div class="card mtgCard" v-bind:class="card.color.toLowerCase()">
                        <div class="card-body mtgCardBody">
                            <h4 class="card-title info rounded col-md-auto" >{{card.name}}</h4>
                            <br/>
                            <h6 class="card-subtitle info col-6 offset-3" >{{card.type}}</h6>
                            <br/>
                            <p class="card-text info col-6 offset-3"> Quantity: {{card.qty}} </p>
                            <button class="btn btn-tiny" @click="add(card)"><i class="fas fa-plus-circle"></i></button>
                            <button class="btn btn-tiny" @click="subtract(card)"><i class="fas fa-minus-circle"></i></button>
                        </div>
                    </div>
                </li>
        </div>
    </ul>
</div>`,
    computed: {}
});