const HomePage = Vue.component('HomePage', {
    mixins: [userMixin],
    template: `
    <div class="row p-3">
        <div class="col-md-4">
            <deck-list collection="competitive">        
            </deck-list>
        </div>
        <div class="col-md-4">
            <deck-list collection="mixed">        
            </deck-list>
        </div>
        <div class="col-md-4">
            <deck-list collection="budget">        
            </deck-list>
        </div>
     
    </div>
        
    `
    });
const MyDecksPage = Vue.component('MyDecksPage', {
    mixins: [userMixin],
    template: `
        <div class="row">
            <div class="col-md-12">
                <deck-list collection="user">        
                </deck-list>
            </div>
            
        </div>
    
    `
})
const CreateDeckPage = Vue.component('CreateDeckPage', {
    mixins: [userMixin],
    props: {

        // userDeck: {type: Object, required: true},


    },

    data: function () {

        return {
            newUserDeck: new UserDeck(),
            searchType: null,
            cardTypeList: [
                {value: null,  text: '-Select a type-'},
                {value: 'artifact-types', text: 'artifact'},
                {value: "", text: 'conspiracy'},
                {value: 'creature-types', text: 'creature'},
                {value: 'enchantment-types', text: 'enchantment'},
                {value: 'spell-types', text: 'instant'},
                {value: 'land-types', text: 'land'},
                {value: "", text: 'phenomenon'},
                {value: "", text: 'plane'},
                {value: "planeswalker-types", text: 'planeswalker'},
                {value: "", text: 'scheme'},
                {value: "spell-types", text: 'sorcery'},
                {value: "", text: 'tribal'},
                {value: "", text: 'vanguard'}

            ],
            searchSubType: null,
            subTypeList: new TypeList(),
            colors: [
                {name: 'White', status: 2, letter: 'w'},
                {name: 'Blue', status: 2, letter: 'u'},
                {name: 'Black', status: 2, letter: 'b'},
                {name: 'Red', status: 2, letter: 'r'},
                {name: 'Green', status: 2, letter: 'g'},
                {name: 'Colorless', status: 2, letter: 'c'},

            ],
            logicOptions: ['NOT', 'AND', 'OR'],
            searchName: '',
            searching: true,
            searchResults: new Deck(),
            cards: [],
            deckTabIndex: 0,
            modalTabIndex: 0,


        };
    },

    computed: {
        loggedIn(){
            return (this.authUser && this.authUser.uid);
        },
        getSubTypes() {

            if (this.searchType) {

                this.subTypeList = new TypeList();


                let url = 'https://api.scryfall.com/catalog/';
                url += this.searchType;

                this.$http
                    .get(url)
                    .then(function (response) {

                        if (response.data.total_values > 0) {


                            this.subTypeList = new TypeList(response.data.data);
                            this.subTypeList.add({value: null, text: '-Select a subtype-'});


                            //response.data.data.forEach(st => this.cardSubTypes.push(st));

                        }
                    })
                    .catch(function (error) {
                        console.error('ajax query error', error);
                    })
                    .finally(function () {
                        this.displaySubTypes();
                    })
            }

        },
        nameState(){
            if(this.newUserDeck.details.deckName != null) {
                return this.newUserDeck.details.deckName.length >= 3
            }
            else
            {
                return false;
            }

        },
        invalidNameFeedback() {

            if(this.newUserDeck.details.deckName != null) {
                if (this.newUserDeck.details.deckName.length > 3) {
                    return ''
                } else if (this.newUserDeck.details.deckName.length > 0) {
                    return 'Please enter at least 3 characters'
                }
                else {
                    return 'Your deck requires a name'
                }
            }
            else {
                return 'Your deck requires a name'
            }
        },
        descriptionState(){
            if(this.newUserDeck.details.deckDescription != null) {
                return this.newUserDeck.details.deckDescription.length >= 5
            }
            else
            {
                return false;
            }
        },
        invalidDescriptionFeedback() {
            if(this.newUserDeck.details.deckDescription != null) {
                if (this.newUserDeck.details.deckDescription.length > 5) {
                    return ''
                } else if (this.newUserDeck.details.deckDescription.length > 0) {
                    return 'Description must be at least 5 characters'
                } else {
                    return 'Your deck needs a description'
                }
            }
            else
            {
                return 'Your deck needs a description'
            }
        },

    },
    methods: {
        addDeck(){
            var theUserDeck = this.newUserDeck;


            // console.log(this.authUser.displayName);
            theUserDeck.createdBy = app.authUser;
            theUserDeck.createDate = new Date();
            theUserDeck.competitiveScore = (theUserDeck.deckList.getTotalCompScore() / theUserDeck.deckList.cardCount());
            theUserDeck.avgCost = (theUserDeck.deckList.getTotalCost() / theUserDeck.deckList.cardCount());
            theUserDeck.mixedScore = (theUserDeck.competitiveScore * theUserDeck.avgCost);



            db.collection('decks2')
                .add(theUserDeck)
                .then(function(docRef){
                    console.log("Deck Created: ", docRef);
                    //TODO: redirect to deck
                    theUserDeck = new UserDeck();
                    alert('Deck Saved');
                    router.push('/home');

                })
                .catch(function(error){
                   console.error("Error adding deck: ", error);
                });



        },

        changeColorOption(color) {
            if (color.status < 2) {
                color.status += 1;
            } else {
                color.status = 0;
            }
            if(this.colors[5].status === 1)
            {
                for(let i = 0; i < 5; i++)
                {
                    this.colors[i].status = 0;
                }
            }

        },
        searchCards() {

            if (this.searchName != null) {
                this.searchResults = new Deck();
                this.cards = [];

                this.searching = true;

                let queryString = '';
                let queryTypes = '';
                //queryString += this.searchName;
                if (this.searchType !== '' && this.searchType !== null) {
                    if (this.searchType.includes('-types')) {
                        queryTypes += ' t:' + this.searchType.slice(0, this.searchType.indexOf('-types'));
                    } else {
                        queryTypes += ' t:' + this.searchType;
                    }
                }

                if (this.searchSubType !== '' && this.searchSubType !== null) {
                    queryTypes += ' t:' + this.searchSubType;
                }


                let notColors = '';
                let andColors = '';
                let orColors = '';
                let colorString = '(c:';
                this.colors.forEach(function(color){
                   if(color.status === 0)
                   {
                       notColors += ' -c:' + color.letter;
                   }
                });
                this.colors.forEach(function(color){
                    if(color.status === 2)
                    {

                        colorString += color.letter + notColors + ') or (c:'
                    }
                });
                this.colors.forEach(function(color){
                    if(color.status === 1)
                    {
                        andColors += color.letter;
                    }
                });
                colorString += andColors + ' ' + notColors + ')';



                // this.colors.forEach(function(color){
                //     if(color.status === 0)
                //     {
                //         // notColors += color.letter;
                //         notColors += ' c!='+ color.letter ;
                //     }
                //     else if (color.status === 1)
                //     {
                //         andColors += color.letter;
                //     }
                //     if(color.status === 2)
                //     {
                //         orColors += ' or c:' + color.letter;
                //     }
                // });
                // queryString += queryTypes + ' ((c:' + andColors + notColors + ')' + orColors + notColors + ')';
                queryString += queryTypes + colorString;


                //build request
                let url = 'https://api.scryfall.com/cards/search';
                let config = {
                    params: {
                        q: this.searchName + queryString,

                    }


                };


                //execute request
                this.$http
                    .get(url, config)
                    .then(function (response) {
                        console.log(response);
                        if (response.data.total_cards > 0) {
                            // this.searchResults = new Deck(response.data.data);
                            var items = response.data.data;
                            for (let i = 0; i < items.length; i++) {

                                this.searchResults.add(items[i], 1);
                            }
                            // items.foreach(card => {
                            //     this.searchResults.add(card, 1);
                            // });



                        }
                    })
                    .catch(function (error) {
                        console.error('ajax query error', error);
                    })
                    .finally(function () {
                        this.searching = false;
                        this.cards = this.searchResults.map(c => c.card);
                        // this.displayCards();

                    })
            }
        },
        showDetailModal(){
            this.$bvModal.show('detailmodal');
        },
        showTutorial() {
            this.$bvModal.hide('detailmodal');
            console.log('test');
            $('#overlay').css("display", "block");
        },
        closeTutorial() {
            $('#overlay').css("display", "none");
        }



    },
    mounted(){
      this.showDetailModal();
    },
    watch: {

    },
    // todo: move card list to its own component
    template:`
    <div class="create deck page">
            
            <div id="overlay" @click.prevent="closeTutorial">
                <div class="text-center overlayContent">
                    <h4>Hover over any card to see options for adding cards to your deck, purchasing and more</h4>
                    <img class="overlayImg" src="img/arrow-2085195_1280.png" height="216" width="320"/>
                    <h5>Click anywhere to continue</h5>
                </div>
            </div>
            
<!--            <div class="container">-->
<!--                <ul class="nav nav-tabs">-->
<!--                    <li class="nav-item">-->
<!--                        <b-button v-b-modal.detailmodal id="detailBtn">Deck Details</b-button>-->
<!--                    </li>-->
<!--                </ul>-->
<!--            </div>-->

            <b-form id="cardForm" @submit.prevent="addDeck()">

                <div  class="container-fluid border">
                    <b-row>
                        <b-col sm="6">
                        
                            <b-nav-form class="form-inline" @submit.prevent="searchCards()">
                            

                                <div id="searchForm"  class="container-fluid border">
                                    <br/>
                                    <b-row>
                                        <b-col sm="6">
                                            
                                            

                                            <b-button v-b-toggle.collapse-types variant="primary">Types</b-button>
                                            <b-collapse id="collapse-types" >
                                                <b-row>
        
                                                    <b-col sm="6">
                                                        <label for="typeSelect">Type: </label>
                                                    </b-col>
                                                    <b-col sm="6" >
                                                        <b-form-select id="typeSelect" size="sm" v-model="searchType" :options="cardTypeList"></b-form-select>
                                                    </b-col>
                                                </b-row>
                                                
                                                <b-row>
        
                                                    <b-col sm="6">
                                                        <label for="subTypeSelect">Subtype: </label>
                                                    </b-col>
                                                    <b-col sm="6">
                                                        <b-form-select  v-if="subTypeList.length > 0" size="sm" class="subTypeSelect" id="subTypeSelect" v-model="searchSubType" :options="subTypeList"></b-form-select>
                                                        <b-form-select v-else size="sm" disabled="disabled"  class="subTypeSelect">
                                                            <option value=""></option>
                                                        </b-form-select>
                                                    </b-col>
                                                </b-row>
                                            </b-collapse>
                                            
                                        </b-col>
                                        <b-col sm="6">
                                            <b-button v-b-toggle.collapse-colors variant="primary">Colors</b-button>
                                            <b-collapse id="collapse-colors">
                                                <b-row>
                                                    <div v-for="color in colors" class="colorButton">
                                                        <button type="button" class="btn btn-sm btn-outline-primary colorBtn mx-1"  @click="changeColorOption(color)">{{logicOptions[color.status]}}</button>
                                                        {{color.name}}
        
                                                    </div>
        
                                                </b-row>
                                            </b-collapse>
                                        </b-col>
                                    </b-row>
                                    
                                    

                                   
                                    <b-row class="text-center mt-2">
                                        <b-col>
                                            <div class="form-group">
                                                <label for="searchInput" class="mr-3">Search term: </label>
                                                <b-form-input id="searchInput" size="sm" type="text" placeholder="Card Search" v-model="searchName"></b-form-input>
                                                <b-button size="sm" type="submit"><i class="fas fa-search"></i></b-button>
                                            </div>
                                        </b-col>

                                    </b-row>
                                    <br/>

                                </div>

                            </b-nav-form>
                        </b-col>
                        <b-col sm="6">
                            <b-row>
                                <b-col sm="4" offset="4" class="text-center">
                                    <b-button v-b-modal.detailmodal id="detailBtn">Deck Details</b-button>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col sm="12" class="text-center">
                                <h1 class="text-light">{{newUserDeck.details.deckName}}</h1>
                                </b-col>
                            </b-row>
                        </b-col>
<!--                        <b-col sm="6" class="text-center p-5">-->
<!--                            <h1 class="text-light">{{newUserDeck.details.deckName}}</h1>-->
<!--                        </b-col>-->
                    </b-row>
                    <b-row>
                        <b-col sm="6" >



                            <b-row>
                                <b-container class="cardList">
                                    <b-row v-if="searching" class="justify-content-sm-center">
                                        <b-col sm="10">
                                            <b-alert show variant="warning">Searching...</b-alert>
                                        </b-col>
                                    </b-row>
                                    <b-row v-else-if="searchResults.length > 0">
<!--                                        <card v-for="card in cards" :key="card.id" :card="card" :deck="newUserDeck.deckList" :buylist="newUserDeck.buyList" :showqty="false" ></card>-->
                                        <card v-for="card in cards" :key="card.id" :card="card" :user-deck="newUserDeck" :showqty="false" :editable="true" ></card>
                                        

                                    </b-row>
                                    <b-row v-else class="justify-content-sm-center">
                                        <b-col sm="10">
                                            <b-alert show variant="danger">No cards found.</b-alert>
                                        </b-col>
                                    </b-row>
                                </b-container>
                            </b-row>

                        </b-col>
                        <b-col id="deckPanel" sm="6">
                            <b-row>
                                <b-tabs v-model="deckTabIndex" justified>
                                    <b-tab v-bind:title="newUserDeck.details.deckName + '(' + newUserDeck.deckList.cardCount() + ')'"  >
                                        <b-container class="cardList">
                                            <b-row v-if="searching" class="justify-content-sm-center">
                                                <b-col sm="10">
                                                    <b-alert show variant="warning">Loading your deck...</b-alert>
                                                </b-col>
                                            </b-row>
                                            <b-row v-else-if="newUserDeck.deckList.length > 0">

<!--                                                <card v-for="card in newUserDeck.deckList" :key="card.card.id" :card="card.card" :deck="newUserDeck.deckList" :buylist="newUserDeck.buyList" :showqty="false" ></card>-->
                                                <card v-for="card in newUserDeck.deckList" :key="card.card.id" :card="card.card" :user-deck="newUserDeck" :showqty="true" :qty="card.quantity" :editable="true"></card>
                                                
                                            </b-row>
                                            <b-row v-else class="justify-content-sm-center">
                                                <b-col sm="10">
                                                    <b-alert show variant="danger">{{newUserDeck.deckList.length}} cards in deck. Add some cards. </b-alert>
                                                </b-col>
                                            </b-row>
                                        </b-container>
                                    </b-tab>
                                    <b-tab v-bind:title="'Buylist (' + newUserDeck.buyList.cardCount() + ')'">
                                        <b-container class="cardList">
                                            <b-row v-if="searching" class="justify-content-sm-center">
                                                <b-col sm="10">
                                                    <b-alert show variant="warning">Loading Buylist...</b-alert>
                                                </b-col>
                                            </b-row>
                                            <b-row v-else-if="newUserDeck.buyList.length > 0">
<!--                                                <card v-for="card in newUserDeck.buyList" :key="card.card.id" :card="card.card" :deck="newUserDeck.deckList" :buylist="newUserDeck.buyList" :showqty="true" :qty="card.quantity"></card>-->
                                                <card v-for="card in newUserDeck.buyList" :key="card.card.id" :card="card.card" :user-deck="newUserDeck" :showqty="true" :qty="card.quantity" :editable="true"></card>
                                                
                                            </b-row>
                                            <b-row v-else class="justify-content-sm-center">
                                                <b-alert show variant="danger">{{newUserDeck.buyList.length}} cards in buy list. Add some cards. </b-alert>
                                            </b-row>
                                        </b-container>
                                        <b-container>
<!--                                            <b-button @click="purchaseAll">Purchase All</b-button>-->
                                        </b-container>

                                    </b-tab>
                                </b-tabs>

                            </b-row>
                        </b-col>
                    </b-row>
                </div>
                <div class="text-lg-center">
                    <b-button type="submit" class="btn btn-lg btn-primary">Save Deck</b-button>
                </div>
            </b-form>

            <b-form id="deckForm" @submit.prevent="showTutorial" >
                <b-modal id="detailmodal" hide-footer hide-header>
                    <b-tabs v-model="modalTabIndex">
                        <b-tab card title="Welcome">
                            <b-card-title>Welcome to the Deck Builder</b-card-title>
                            <b-card-body>
                                <b-button @click="modalTabIndex++;">Click here to get started</b-button>
    <!--                            <b-button @click="loadDecks">Load Saved Deck</b-button>-->
                            </b-card-body>
                        </b-tab>
                        <b-tab card title="Deck Info">
                            <b-card-title>Lets get some basic information</b-card-title>
                            <b-card-body>
                                <b-form-group
                                    id="nameGroup"
                                    description="Enter a deck name"
                                    label="Enter deck name"
                                    label-for="deckNameInput"
                                    :invalid-name-feedback="invalidNameFeedback"
                                    :nameState="nameState">
                                    <b-form-input id="deckNameInput" v-model="newUserDeck.details.deckName" :state="nameState" trim></b-form-input>

                                </b-form-group>
                                <b-form-group
                                        id="descriptionGroup"
                                        description="Enter a Description"
                                        label="Enter a description"
                                        label-for="deckDescriptionInput"
                                        :invalid-description-feedback="invalidDescriptionFeedback"
                                        :nameState="descriptionState">
                                    <b-form-textarea
                                            id="deckDescriptionInput"
                                            v-model="newUserDeck.details.deckDescription"
                                            placeholder="Enter a description"
                                            rows="3"
                                            max-rows="6"
                                            :state="descriptionState" trim></b-form-textarea>

                                </b-form-group>
                                <b-button @click="modalTabIndex++">Next</b-button>
                            </b-card-body>
                        </b-tab>
                        <b-tab card title="Additional Details">

                            <b-card no-body>
                                <b-card-header header-tag="header" role="tab">
                                    <b-button block v-b-toggle.collapse-sharing variant="primary">Sharing Options</b-button>
                                </b-card-header>
                                <b-collapse id="collapse-sharing" accordian="accordian">
                                    <b-card-body>
                                        <b-row>
                                            <b-col sm="5">

                                                <b-form-checkbox
                                                        id="privateCheck"
                                                        v-model="newUserDeck.details.private"
                                                        name="private"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Private
                                                </b-form-checkbox>
                                                <b-form-checkbox
                                                        id="archivedCheck"
                                                        v-model="newUserDeck.details.archived"
                                                        name="archived"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Archived
                                                </b-form-checkbox>

                                                <b-form-checkbox
                                                        id="helpCheck"
                                                        v-model="newUserDeck.details.needsHelp"
                                                        name="needsHelp"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Needs Help
                                                </b-form-checkbox>

                                            </b-col>
                                            <b-col sm="5">
                                                <b-form-checkbox
                                                        id="prototypeCheck"
                                                        v-model="newUserDeck.details.prototype"
                                                        name="prototype"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Prototype
                                                </b-form-checkbox>

                                                <b-form-checkbox
                                                        id="draftChecked"
                                                        v-model="newUserDeck.details.draft"
                                                        name="draft"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Draft
                                                </b-form-checkbox>
                                                <b-form-checkbox
                                                        id="sealedCheck"
                                                        v-model="newUserDeck.details.sealed"
                                                        name="sealed"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Sealed
                                                </b-form-checkbox>


                                            </b-col>
                                        </b-row>
                                    </b-card-body>

                                </b-collapse>
                            </b-card>
                            <b-card no-body>
                                <b-card-header>
                                    <b-button block v-b-toggle.collapse-other variant="primary">Other Options</b-button>
                                </b-card-header>
                                <b-collapse id="collapse-other" accordian="accordian">
                                    <b-card-body>
                                        <b-row>
                                            <b-col sm="5">

                                                <b-form-checkbox
                                                        id="onProfileCheck"
                                                        v-model="newUserDeck.details.onProfile"
                                                        name="onProfile"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Appears on Profile
                                                </b-form-checkbox>
                                                <b-form-checkbox
                                                        id="syncInventoryCheck"
                                                        v-model="newUserDeck.details.syncInventory"
                                                        name="syncInventory"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Sync with Inventory
                                                </b-form-checkbox>

                                                <b-form-checkbox
                                                        id="noRevisionsCheck"
                                                        v-model="newUserDeck.details.noRevisions"
                                                        name="noRevisions"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Disable revisions
                                                </b-form-checkbox>
                                                <b-form-checkbox
                                                        id="showOtherCheck"
                                                        v-model="newUserDeck.details.showOther"
                                                        name="showOther"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Show other decks
                                                </b-form-checkbox>


                                            </b-col>
                                            <b-col sm="5">
                                                <b-form-checkbox
                                                        id="ignoreSuggestionsCheck"
                                                        v-model="newUserDeck.details.ignoreSuggestions"
                                                        name="ignoreSuggestions"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Ignore Suggestions
                                                </b-form-checkbox>

                                                <b-form-checkbox
                                                        id="publicAcquireChecked"
                                                        v-model="newUserDeck.details.publicAcquire"
                                                        name="publicAcquire"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Public acquire board
                                                </b-form-checkbox>
                                                <b-form-checkbox
                                                        id="showCompetitiveCheck"
                                                        v-model="newUserDeck.details.showCompetitive"
                                                        name="showCompetitive"
                                                        value="true"
                                                        unchecked-value="false"
                                                >
                                                    Show competitive meter
                                                </b-form-checkbox>


                                            </b-col>
                                        </b-row>
                                    </b-card-body>

                                </b-collapse>

                            </b-card>

                            <br/>


                            <b-button type="submit" id="dismissDetailBtn" @click="showTutorial">Continue</b-button>
    

                        </b-tab>
                    </b-tabs>
                </b-modal>
            </b-form>
            
        </div>
    `

});
const EmptyRouterView = Vue.component('EmptyRouterView', {
    mixins: [userMixin],
    template: `
    <div>
        <router-view name="dialog" :authUser="authUser"></router-view>
        <router-view :authUser="authUser"></router-view>
    </div>
    `
});
const CreateTutorial = Vue.component('CreateTutorial',{
    mixins: [userMixin],
    methods:{
        close(){
            this.$router.back()
        }
    },
    template: `
            <div id="overlay" @click="close">
                <div class="text-center overlayContent">
                    <h4>Hover over any card to see options for adding cards to your deck, purchasing and more</h4>
                    <img class="overlayImg" src="img/arrow-2085195_1280.png" height="216" width="320"/>
                    <h5>Click anywhere to continue</h5>
                </div>
            </div>
   `
});
const DeckDetailPage = Vue.component('DeckDetailPage', {
    mixins: [userMixin],
    props: {
        id: {type: String, required: true, default: ''},
    },
    data: function(){
      return {
          userDeck: null,
      };
    },
    firestore: function(){
        return {
            userDeck: db.collection('decks2').doc(this.id),
        };
    },
    template: `
        <div>
            <deck-detail v-if="userDeck" :userDeck="userDeck" :auth-user="authUser"></deck-detail>
        <loading v-else></loading>
        </div>  
        
        
    `
})

