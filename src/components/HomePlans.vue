<template>
    <v-container grid-list-lg>
        <v-layout row>
            <v-flex xs12 class="text-xs-center display-1 font-weight-black my-5"
                >Wpisz składniki jakie masz w lodówce</v-flex
            >
        </v-layout>
        <v-layout row>
            <v-text-field v-model="ingredients" label="Rozdzielaj składniki przecinkami"></v-text-field>
            <v-card-actions v-if="['menu'].includes($route.name)">
                <v-btn
                    outline
                    block
                    color="green"
                    @click="showRecipes('keto')"
                    data-cy="plansKetoBtn"
                >
                    Szukaj przepisów</v-btn
                >
            </v-card-actions>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'HomePlans',
	data() {
		return {
			ingredients: '',
		};
	},
    methods: {
        showRecipes(plan) {
            this.$store.dispatch('getRecipes', this.ingredients);
        }
    }
};
</script>

<style scoped></style>
