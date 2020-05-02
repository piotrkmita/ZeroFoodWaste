import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import firebase from 'firebase';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        recipes: [],
        apiUrl: 'https://www.themealdb.com/api/json/v1/1/search.php?f=a',
        user: null,
        isAuthenticated: false,
        userRecipes: []
    },
    mutations: {
        setRecipes(state, payload) {
            state.recipes = payload;
        },
        setUser(state, payload) {
            state.user = payload;
        },
        setIsAuthenticated(state, payload) {
            state.isAuthenticated = payload;
        },
        setUserRecipes(state, payload) {
            state.userRecipes = payload;
        }
    },
    actions: {
         connect() {
            var method = 'GET';
            var text = "kurczak,czosnek"; //TODO z pola do wpisywania
            var URL = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyCl-ODcT4cmDwsqry5be0X-1MTj-L0607k&target=en&q=${text}`;
            var xhr = new XMLHttpRequest();
            xhr.open(method, URL, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const response = xhr.responseText
                    console.log(response);
                    let obj = JSON.parse(response);
                    var ingredients = console.log(obj.data.translations[0].translatedText)
                    connect2(ingredients)
                } else {
                    console.log("Błąd podczas ładowania strony\n");
                }
            };
            xhr.send();
        },
        connect2(ingredients) {
            var method = 'GET';
            var URL = `https://api.edamam.com/search?app_id=9b02b0d2&app_key=3e0507e80d6e8ea558281c1456597d93&q=${ingredients}`;
            var xhr = new XMLHttpRequest();
            xhr.open(method, URL, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const response = xhr.responseText
                    console.log(JSON.parse(response)); //TODO do wyswietlic w ludzkiej formie
                } else {
                    console.log("Błąd podczas ładowania strony\n");
                }
            };
            xhr.send();
        },
        async getRecipes({ state, commit }, plan) {
            try {
				let text = plan;
                let translate = await axios.get(`https://translation.googleapis.com/language/translate/v2?key=AIzaSyCl-ODcT4cmDwsqry5be0X-1MTj-L0607k&target=en&q=${text}`);
				let ingredients = translate.data.data.translations[0].translatedText;
				let edamam = await axios.get(`https://api.edamam.com/search?app_id=9b02b0d2&app_key=3e0507e80d6e8ea558281c1456597d93&q=${ingredients}`);
				console.log(edamam.data.hits[0].recipe)
                commit('setRecipes', edamam.data.hits);
            } catch (error) {
                commit('setRecipes', []);
            }
        },
        userLogin({ commit }, { email, password }) {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(user => {
                    commit('setUser', user);
                    commit('setIsAuthenticated', true);
                    router.push('/about');
                })
                .catch(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    router.push('/');
                });
        },
        userJoin({ commit }, { email, password }) {
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(user => {
                    commit('setUser', user);
                    commit('setIsAuthenticated', true);
                    router.push('/about');
                })
                .catch(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    router.push('/');
                });
        },
        userSignOut({ commit }) {
            firebase
                .auth()
                .signOut()
                .then(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    router.push('/');
                })
                .catch(() => {
                    commit('setUser', null);
                    commit('setIsAuthenticated', false);
                    router.push('/');
                });
        },
        addRecipe({ state }, payload) {
            firebase
                .database()
                .ref('users')
                .child(state.user.user.uid)
                .push(payload.recipe.label);
        },
        getUserRecipes({ state, commit }) {
            return firebase
                .database()
                .ref('users/' + state.user.user.uid)
                .once('value', snapshot => {
                    commit('setUserRecipes', snapshot.val());
                });
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null && state.user !== undefined;
        }
    }
});
