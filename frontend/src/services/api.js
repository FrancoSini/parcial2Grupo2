// src/services/api.js
import axios from 'axios'

// Usa la variable de entorno VITE_API_URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
})

// Adjunta el token JWT a cada request automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el servidor devuelve 401, limpia la sesión y redirige al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// --- Auth ---
export const loginRequest     = (data)        => api.post('/auth/login', data)
export const registerRequest  = (data)        => api.post('/auth/register', data)
export const getPerfilRequest = ()            => api.get('/auth/perfil')

// --- Transacciones ---
export const getTransaccionesRequest    = ()         => api.get('/transacciones')
export const getTransaccionByIdRequest  = (id)       => api.get(`/transacciones/${id}`)
export const getBalanceRequest          = ()         => api.get('/transacciones/balance')
export const createTransaccionRequest   = (data)     => api.post('/transacciones', data)
export const updateTransaccionRequest   = (id, data) => api.put(`/transacciones/${id}`, data)
export const deleteTransaccionRequest   = (id)       => api.delete(`/transacciones/${id}`)

// --- Categorías ---
export const getCategoriasRequest   = ()     => api.get('/categorias')
export const createCategoriaRequest = (data) => api.post('/categorias', data)

export default api
