import axios from 'axios'

const weather = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})
const ninjas = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_AUTOCOMPLETE,
  headers: {
    'X-Api-Key': import.meta.env.VITE_API_KEY_AUTOCOMPLETE,
  },
})

export default {weather, ninjas}