import axios from 'axios'

import { API_URL } from '../constants/'

const authHeader = {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}

const authApi = {
  login: (email, password) => axios.post(`${API_URL}/login`, {
    email,
    password
  }),

  register: (first_name, email, password, password_confirmation) => axios.post(`${API_URL}/register`, {
    first_name,
    email,
    password,
    password_confirmation
  }),

  me: () => axios.get(`${API_URL}/user`, authHeader),
}

export default authApi