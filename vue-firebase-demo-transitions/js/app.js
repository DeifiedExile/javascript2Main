Vue.use(Vuefire);

// Initialize App
var app = new Vue({
    // el: the DOM element to be replaced with a Vue instance
    el: '#app',

    // data: all the data for the app
    data: {
        newRecipe: {
            recipe: new Recipe(),
            image: null,
        },
        recipes: [], // placeholder until firebase data is loaded
        addRecipeModal: false, // show/hide modal
    },

    firestore: {
        // bind as an array by default
        recipes: db.collection('recipes').orderBy('rating', 'desc'),
    },

    // methods: usually "events" triggered by v-on:
    methods: {
        addRecipe(){
            // create local reference to the newRecipe
            let theRecipe = this.newRecipe;

            // do some validation
            // TODO

            // add recipe to firebase
            db.collection('recipes')
                .add(theRecipe.recipe)
                .then((docRef) => {
                    console.log('Document Added:', docRef);

                    // add an image with the same id
                    this.addImage(docRef.id);

                    // clear the form
                    theRecipe.recipe = new Recipe();
                    //this.newRecipe.recipe = new Recipe();
                })
                .catch((error) => {
                    console.error('Error adding recipe:', error);

                    // TODO: let user know
                });
        },
        addImage(docId){
            // docId and image file are required
            if(!docId || !this.newRecipe.image){
                return false;
            }

            // create a filename we know will be unique
            // the other option would be to create a folder for each recipe
            let theRecipe = this.newRecipe;
            let allowedTypes = ['jpg', 'png', 'gif'];
            let extension = theRecipe.image.name.toLowerCase().split('.').pop()

            // validate extension
            if(allowedTypes.indexOf(extension) < 0){
                // invalid extension

                // let the user know...
                // TODO: let the user know WITHOUT alerts
                alert('Invalid file type.');

                return false;
            }

            // validate size (less than 200KB
            if(theRecipe.image.size > (200 * 1024)){
                // file too large

                // let the user know...
                // TODO: let the user know WITHOUT alerts
                alert('File too large. 200KB max');

                return false;
            }

            // add image to firebase
            //storage.child('recipes/' + docId)
            storage.child('recipes').child(docId).child('images')
                .put(theRecipe.image)
                .then((snapshot) => {
                    console.log('Image added', snapshot);

                    // clear the form
                    theRecipe.image = null;

                    // update the recipe with the image url
                    return snapshot.ref.getDownloadURL();
                })
                .then((url) => {
                    return db.collection('recipes').doc(docId).update({image: url});
                })
                .then((docRef) => {
                    console.log('Recipe updated with image');
                })
                .catch((error) => {
                    console.error('Error adding image', error);
                });
        }
    },

    // computed: values that are updated and cached if dependencies change
    computed: {

    },

    //mounted:  called after the instance has been mounted,
    mounted: function() {

    },

    // watch: calls the function if the value changes
    // https://travishorn.com/add-localstorage-to-your-vue-app-in-2-lines-of-code-56eb2c9f371b
    watch: {

    }
});

