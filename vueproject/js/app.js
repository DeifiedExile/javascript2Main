var app = new Vue({
    el: '#app',
    data: {
        newCard: {
            name: '',
            qty: 1,
            type: 'Land',
            color: 'colorless'
        },
        filterOptions: {
            color: '',
            type: ''
        },
        cardList: [
            {name: 'Forest', qty: 20, type: 'Land', color: 'silver'},
            {name: 'Island', qty: 20, type: 'Land', color: 'silver'},
            {name: 'Mountain', qty: 20, type: 'Land', color: 'silver'},
            {name: 'Swamp', qty: 20, type: 'Land', color: 'silver'},
            {name: 'Plains', qty: 20, type: 'Land', color: 'silver'},

            {name: 'Grizzly Bears', qty: 4, type: 'Creature', color: 'Green'},
            {name: 'Sun Titan', qty: 2, type: 'Creature', color: 'White'},
            {name: 'Solemn Simulacrum', qty: 4, type: 'Creature', color: 'silver'},
            {name: 'Blood Artist', qty: 4, type: 'Creature', color: 'Black'},
            {name: 'Mulldrifter', qty: 4, type: 'Creature', color: 'Blue'},
            {name: 'Raging Goblin', qty: 4, type: 'Creature', color: 'Red'},

            {name: 'Counterspell', qty: 2, type: 'Instant', color: 'Blue'},
            {name: 'Swords to Plowshares', qty: 2, type: 'Instant', color: 'White'},
            {name: 'Beast Within', qty: 2, type: 'Instant', color: 'Green'},
            {name: 'Chaos Warp', qty: 2, type: 'Instant', color: 'Red'},
            {name: 'Vampiric Tutor', qty: 2, type: 'Instant', color: 'Black'},


            {name: 'Pacifism', qty: 1, type: 'Enchantment', color: 'White'},
            {name: 'Rhystic Study', qty: 1, type: 'Enchantment', color: 'Blue'},
            {name: 'Phyrexian Arena', qty: 1, type: 'Enchantment', color: 'Black'},
            {name: 'Sylvan Library', qty: 1, type: 'Enchantment', color: 'Green'},
            {name: 'Warstorm Surge', qty: 1, type: 'Enchantment', color: 'Red'},

            {name: 'Duress', qty: 2, type: 'Sorcery', color: 'Black'},
            {name: 'Cultivate', qty: 2, type: 'Sorcery', color: 'Green'},
            {name: 'Blasphemous Act', qty: 2, type: 'Sorcery', color: 'Red'},
            {name: 'Ponder', qty: 2, type: 'Sorcery', color: 'Blue'},
            {name: 'Wrath of God', qty: 2, type: 'Sorcery', color: 'White'},

            {name: 'Jaya Ballard', qty: 2, type: 'Planeswalker', color: 'Red'},
            {name: 'Elspeth, Sun\'s Champion', qty: 2, type: 'Planeswalker', color: 'White'},
            {name: 'Tezzeret the Seeker', qty: 2, type: 'Planeswalker', color: 'Blue'},
            {name: 'Liliana Vess', qty: 2, type: 'Planeswalker', color: 'Black'},
            {name: 'Nissa, Vital Force', qty: 2, type: 'Planeswalker', color: 'Green'},

            {name: 'Karn, Silver Golem', qty: 1, type: 'Artifact', color: 'silver'},
            {name: 'Sol Ring', qty: 1, type: 'Artifact', color: 'silver'},
            {name: 'Lightning Greaves', qty: 1, type: 'Artifact', color: 'silver'},
            {name: 'Skullclamp', qty: 1, type: 'Artifact', color: 'silver'},

        ],
    },
    // components: {
    //    mtg-card-list: mgt-card-list
    // },
    methods: {
        addCard: function () {
            this.cardList.push(this.newCard);
            this.newCard = {
                name: '',
                qty: 1,
                type: 'Land',
                color: 'silver'
            };
            $('#addCardModal').modal('hide');

        },
        removeCard(card) {
            this.cardList.splice(this.cardList.indexOf(card), 1);
        },
    },
    computed: {
        getCards: function () {
            var colorChoice = this.filterOptions.color.toString();
            var typeChoice = this.filterOptions.type.toString();
            return this.cardList.filter(function (card) {
                return card.color.toUpperCase().includes(colorChoice.toUpperCase()) && card.type.toUpperCase().includes(typeChoice.toUpperCase());
            });
        },


    },
    mounted: function () {
        if (localStorage.getItem('cardList')) {
            this.cardList = JSON.parse(localStorage.getItem('cardList'));
        }
    },
    watch: {
        filterOptions: {
            handler: function () {

            }

        },
        deep: true,


        cardList: {
            handler: function (newList) {
                localStorage.setItem('cardList', JSON.stringify(newList));
            },
            deep: true
        }
    }
});