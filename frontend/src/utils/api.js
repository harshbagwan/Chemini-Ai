import axios from 'axios'

// Uses Vite proxy: /api/* → http://localhost:5000/api/*
// This preserves all original backend routes unchanged
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
})

export default API
