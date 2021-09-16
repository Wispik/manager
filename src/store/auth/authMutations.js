import axios from "../../axios";


export default  {
  SET_TOKEN(state, accessToken){
    axios.defaults.headers.common['Authorization'] = accessToken;
    localStorage.setItem('accessToken', accessToken);
    state.accessToken = accessToken;
  },
  SET_REFRESH_TOKEN(state, refreshToken) {
    state.refreshToken = refreshToken;
    localStorage.setItem('refreshToken', refreshToken);
    state.refreshToken = refreshToken;
  }
}
