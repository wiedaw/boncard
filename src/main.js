import Vue from 'vue'

//Vuetify https://vuetifyjs.com/en/
import vuetify from './plugins/vuetify'

//Vue-Router https://router.vuejs.org/
import VueRouter from 'vue-router'
Vue.use(VueRouter);

// Vuelidate https://vuelidate.js.org/
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate);

// axios https://github.com/axios/axios
import axios from 'axios';
Vue.prototype.$axios = axios.create({
	baseURL: 'http://test.boncard.pl/rekrutacja/api/'
});

//Import main components
import App from './App.vue'
import Home from './components/Home.vue';
import Card from './components/NewCard.vue';
import EditCard from './components/EditCard.vue';

const router = new VueRouter({
    mode: 'history',
    routes: [
		{ path: '/', component: Home, name: 'home' },
		{ path: '/card', component: Card, name: 'card' },
		{ path: '/edit/:id', component: EditCard, name: 'editcard' }
  ]
})

Vue.config.productionTip = false

new Vue({
	vuetify,
	router,
	render: h => h(App)
}).$mount('#app')
