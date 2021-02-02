import Vue from 'vue';
import Vuex from 'vuex';
import axios from "axios";
import { TWEEN } from "@nativescript-community/tween";
import * as ApplicationSettings from "application-settings";

// All possible Pet Types are defined in petTypes.json
// Add types & information there. 
import petTypes from "./petTypes.json";

const stateVersion = 'state' + 1;

const NSVuexPersist = store => {
    // Get saved state & initialize with it.
    if (ApplicationSettings.getString(stateVersion)) {
        var oldState = JSON.parse(ApplicationSettings.getString(stateVersion));
        oldState.connected = false;
        oldState.actionStatus = store.state.actionStatus;
        store.replaceState(oldState);
    }

    // Save the current state when a mutation happens.
    store.subscribe((mutation, state) => {
        ApplicationSettings.setString(stateVersion, JSON.stringify(state));
    })

};

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // api_prefix: 'http://192.168.178.21/',
        api_prefix: 'https://ap-pet-tite.herokuapp.com/',
        updateFrequencyInMS: 1500,
        weight: 0,
        maxWeight: 5000,
        connected: false,
        productId: 1337,
        actionStatus: {
            tare: null,
            resetToInit: null,
            calibrationStepOne: null,
            calibrationStepTwo: null,
        },
        petType: null,
        petSubType: null,
    },
    mutations: {
        set_productId(state, payload) {
            state.productId = payload;
        },

        set_weight(state, payload) {
            state.weight = payload;
        },

        set_maxWeight(state, payload) {
            state.maxWeight = payload;
        },

        set_connected(state, payload) {
            state.connected = payload;
        },

        update_actionStatus(state, { name, status }) {
            state.actionStatus[name] = status;
        },

        set_petType(state, payload) {
            state.petType = payload;
        },

        set_petSubType(state, payload) {
            state.petSubType = payload;
        },
    },
    actions: {
        set_productId({ commit }, payload) {
            commit('set_productId', payload)
        },

        set_maxWeight({ commit }, payload) {
            commit('set_maxWeight', payload)
        },

        set_petType({ commit }, payload) {
            commit('set_petType', payload)
        },

        set_petSubType({ commit }, payload) {
            commit('set_petSubType', payload)
        },


        getWeightData({ state, commit, dispatch }) {
            axios({
                    method: 'get',
                    url: state.api_prefix + state.productId
                })
                .then(({ data }) => {
                    if (data.success) {
                        dispatch('animateWeight', data.value.weight);
                        commit('set_connected', data.value.connected);

                        let statusTimeStamps = [];
                        for (let name in state.actionStatus) {
                            if (state.actionStatus[name] !== null) {
                                statusTimeStamps.push(String(state.actionStatus[name]));
                            }
                        }

                        if (statusTimeStamps.length > 0) {
                            for (const [key, value] of Object.entries(data.value.actionsQueue)) {
                                if (statusTimeStamps.includes(key) && value.done) {
                                    commit('update_actionStatus', { name: value.name, status: null });
                                    dispatch('deleteDoneAction', key);
                                }
                            }
                        }
                    } else {
                        dispatch('animateWeight', 0);
                        commit('set_connected', 'error');
                    }
                })
                .catch((error) => {
                    commit('set_connected', false);
                    console.error(error);
                })
                .then(() => {
                    setTimeout(() => { dispatch('getWeightData'); }, state.updateFrequencyInMS);
                });
        },


        sendAction({ state, commit }, { name, data = {} }) {
            axios({
                    method: 'post',
                    url: state.api_prefix + name + '/' + state.productId,
                    data
                })
                .then(({ data }) => {
                    if (data.success) {
                        commit('update_actionStatus', { name, status: data.time });
                    }
                })
                .catch(console.error);
        },


        deleteDoneAction({ state }, actionTimeStamp) {
            axios({
                    method: 'post',
                    url: state.api_prefix + 'delete/' + state.productId + '/' + actionTimeStamp
                })
                .then(({ data }) => {
                    if (data.success) {
                        console.log('deleteDoneAction', data);
                    }
                })
                .catch(console.error);
        },



        animateWeight({ state, commit }, weight) {
            new TWEEN.Tween({ value: state.weight })
                .easing(TWEEN.Easing.Linear.None)
                .to({ value: weight }, 1000)
                .onUpdate((obj) => {
                    commit('set_weight', Math.max(0, obj.value).toFixed(3));
                })
                .start();
        },
    },

    getters: {
        get_productId: state => {
            return state.productId;
        },

        get_weight: state => {
            return state.weight;
        },

        get_maxWeight: state => {
            return state.maxWeight;
        },

        get_actionStatus: state => {
            return state.actionStatus;
        },

        get_connected: state => {
            return state.connected;
        },

        get_loadStatus: state => {
            return (Object.values(state.actionStatus).find(el => el !== null) !== undefined);
        },

        get_petType: state => {
            return state.petType;
        },

        get_petTypes: () => {
            let petTypesNames = petTypes.map(obj => obj.name);
            return petTypesNames;
        },

        get_petSubType: state => {
            return state.petSubType;
        },

        get_petSubTypes: state => {
            let petSubTypesNames = petTypes[state.petType].subTypes.map(obj => obj.name);
            return petSubTypesNames;
        },

        get_currentPetTipsDescription: state => {
            return petTypes[state.petType].description;
        },

        get_currentPetTips: state => {
            return petTypes[state.petType].subTypes[state.petSubType].text;
        },

    },
    plugins: [NSVuexPersist]
});