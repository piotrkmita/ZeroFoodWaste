<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12 sm6 md6 lg4 v-for="(item, idx) in recipes" :key="idx">
                <v-card data-cy="recipeEntry">
                    <v-responsive>
                        <v-img :src="item.recipe.image"></v-img>
                    </v-responsive>

                    <v-card-text>
                        <div class="title my-5">{{ item.strArea }}</div>

                        <div class="subheading">Składniki</div>
                        <ul>
                            <li
                                v-for="(ingredient, i) in item.recipe
                                    .ingredients"
                                :key="i"
                            >
                                {{ ingredient.text }}
                            </li>
                        </ul>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'MealRecipes',
    computed: {
        recipes() {
            return this.$store.state.recipes;
        },
        isAuthenticated() {
            return this.$store.getters.isAuthenticated;
        }
    },
    methods: {
    }
};
</script>

<style scoped></style>
