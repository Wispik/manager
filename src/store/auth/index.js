import state from './authState';
import actions from './authActions';
import mutations from './authMutations';
import getters from './authGetters';
import axios from "../../axios";
import router from '../../router';



export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
