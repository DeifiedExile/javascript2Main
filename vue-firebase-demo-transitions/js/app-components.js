Vue.component('recipe', {
    props: {
        recipe: {type: Object, required: true},
    },

    data: function(){
        return {
            showDetails: false,
        };
    },

    computed: {


    },

    methods: {
        like(){
            // increment rating... max of 5
            let newRating = this.recipe.rating + .5;
            if(newRating > 5){
                newRating = 5;
            }

            // update rating
            db.collection('recipes').doc(this.recipe.id).update({rating: newRating});
            // TODO add .catch()
        },

        remove(){
            // remove image
            storage.child('recipes').child(this.recipe.id).delete();

            // remove recipe
            db.collection('recipes').doc(this.recipe.id).delete();
        },

    },

    template: `
        <b-card class="recipe mb-3" :header="recipe.name" header-bg-variant="primary" header-text-variant="white">
            <b-card-text>
                <b-row class="bottom-divider">
                    <b-col md="6" class="d-flex flex-column">
                        <div v-if="recipe.rating" class="rating">
<!--                            <transition-group name="zoom">-->
                            <transition-group enter-active-class="animated tada">
                             <i v-for="n in Math.floor(recipe.rating)" :key="n" class="fas fa-star"></i>
                             </transition-group>
                            <template v-if="recipe.rating % 1 > .3">
                                <i class="fas fa-star-half-alt"></i>
                                <i v-for="n in Math.ceil(4 - recipe.rating)" class="far fa-star"></i>
                            </template>
                             <template v-else>
                                <i v-for="n in Math.ceil(5 - recipe.rating)" class="far fa-star"></i>
                            </template>
                        </div>
                        
                        
                        <div v-if="recipe.description" class="description">{{recipe.description}}</div>
                        
                        <div class="buttons mt-auto d-flex flex-row justify-content-around">
                            <b-button size="sm" variant="outline-primary" @click="like"><i class="fas fa-thumbs-up"></i> Like It</b-button>
                            <b-button size="sm" variant="outline-primary"><i class="fab fa-pinterest"></i></i> Pin It</b-button>
                            <b-button size="sm" variant="outline-primary"><i class="fas fa-share-alt"></i> Share It</b-button>
                            <b-button size="sm" variant="outline-primary" @click="remove"><i class="fas fa-trash"></i> Trash It</b-button>
                            
                        </div>
                    </b-col>
                    
                    <b-col md="6">
                        <b-img :src="recipe.image" class="recipe-image"></b-img>
                    </b-col>
                    
                </b-row>
                <b-row>
                    <b-col md="6" class="md-col-divider">
                        <h5>Ingredients</h5>
                        <ul>
                            <li v-for="(ingredient, i) in recipe.ingredients">{{ingredient}}</li>
                        </ul>
                    </b-col>
                    <b-col md="6">
                        <h5>Directions</h5>
                        <ol>
                            <li v-for="(direction, i) in recipe.directions">{{direction}}</li>
                        </ol>
                    </b-col>
                </b-row>
            </b-card-text>
        </b-card>
       
    `,

});