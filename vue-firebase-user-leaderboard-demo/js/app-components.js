Vue.component('leaderboard', {
    props: {
        authUser: {type: Object},
    },

    data: function(){
        return {
            board: null,
        };
    },

    firestore: function(){
        return {
            board: db.collection('leadItBoard').orderBy('score', 'desc').limit(3)
        };
    },

    template: `
        <div>
            <h3>Leaderboard</h3>
            <b-container v-if="board">
                <b-row v-for="item in board" :key="item.id" :class="{'text-success font-weight-bold': (authUser && authUser.uid == item.id)}">
                    <b-col>{{item.displayName}}</b-col>
                    <b-col>{{item.score}}</b-col>
                </b-row>
            </b-container>
        </div>
       
    `,

});

