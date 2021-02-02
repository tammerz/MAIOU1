import Vue from 'nativescript-vue'
import App from './components/App'
import VueDevtools from 'nativescript-vue-devtools'
import globalNames from "./globalNames.json";

if (TNS_ENV !== 'production') {
    Vue.use(VueDevtools)
}
import store from './store'

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production');

// Hide debug RenderLogs from NS
Vue.config.suppressRenderLogs = true;

Vue.prototype.$GN = globalNames

new Vue({
    store,
    render: h => [h(App)],
    async mounted() {
        this.$store.dispatch("getWeightData");
    },
}).$start()



/**
 * ignore copy paste 
 * random commands
 * ns resources generate splashes "<Path to image>\ressources\logo.png" --background #d7af85
 * ns resources generate icons "<Path to image>\ressources\icon.png"
 */