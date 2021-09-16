// axios
import axios from 'axios'
const baseURL = "https://api-slender.zubareva.online/api";

export default axios.create({
  baseURL: baseURL,
  headers: {
    common: {
      'Authorization': localStorage.getItem('accessToken') || ''
    }
  }
})
