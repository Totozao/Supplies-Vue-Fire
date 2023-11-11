import { createApp } from 'vue'
import App from './App.vue'
import Home from './components/Home-page.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader';
import { initializeApp } from 'firebase/app';

// Load custom fonts
loadFonts();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6TBzpG4rooZnOeWzK-Y6FuoNwuWtAB7w",
  authDomain: "supplies-782c5.firebaseapp.com",
  projectId: "supplies-782c5",
  storageBucket: "supplies-782c5.appspot.com",
  messagingSenderId: "761520225918",
  appId: "1:761520225918:web:e28f892670250bf548e22f",
  measurementId: "G-VXBFNZFY1T"
};

// Initialize Firebase
initializeApp(firebaseConfig);


// Import Vue Router
import { createRouter, createWebHistory } from 'vue-router';

// Create a router instance
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home }, // Set Home-page.vue as the default view
  ],
});

// Create the Vue app with Vue Router
createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app');
