import store from "@/store/store";
import axios from "../../axios";
import actions from "../../store/auth/authActions";
import router from "../../router";

const localToken = 'accessToken';
const localRefreshToken = 'refreshToken';


axios.interceptors.response.use(response => {
  return response
}, async error => {
  if (error.response.status === 403) {
    let lastRequest = error.config;

    try {
      const accessToken = await store.dispatch('auth/refreshToken');
      lastRequest.headers.Authorization = accessToken;

      console.dir(accessToken);
      return new Promise(resolve => {
        resolve(axios.request(lastRequest));
      });
    } catch (e) {
      router.replace('/logout');
    }
  }

  router.replace('/logout');
});

class AuthService {
  token = null;
  refreshToken = null;

  login(
    email, password
  ) {
    store.dispatch('auth/login', {
      email,
      password,
    });
  }

  logOut() {
    localStorage.removeItem(localToken);
    localStorage.removeItem(localRefreshToken);

    this.profile = null;
    this.token = null;
    this.refreshToken = null;
  }

  isAuthenticated() {
    return localStorage.getItem(localToken);
  }
}

let instance;

export default () => {
  if (!instance) {
    instance = new AuthService();
  }

  return instance;
};
