import axios from "../../axios";
import router from '@/router';

export default {
  /**
   * Авторизация
   *
   * @param commit
   * @param email
   * @param password
   */
  login({commit}, {
    email,
    password
  }) {
    return new Promise(async (resolve, reject) => {
      const {data} = await axios.request('/auth/login', {
        method: 'POST',
        data: {
          email,
          password,
        }
      });

      if (data.message) {
        reject(data.message);
      }

      commit('SET_TOKEN', data.access_token);
      commit('SET_REFRESH_TOKEN', data.refresh_token);

      router.push('/');
    });
  },

  refreshToken({commit, state},) {
    return new Promise(async (resolve, reject) => {
      const {data} = await axios.request('/auth/refresh', {
        method: 'POST',
        data: {
          refresh_token: state.refreshToken,
        },
      });

      if (data.message) {
        reject(data.message);
      }

      commit('SET_TOKEN', data.access_token);
      commit('SET_REFRESH_TOKEN', data.refresh_token);

      resolve(data.access_token);
    });
  },
}
