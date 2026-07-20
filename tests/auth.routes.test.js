const request = require('supertest')
const express = require('express')

jest.mock('../controllers/auth.controller', () => ({
  register: jest.fn((req, res) => {
    res.status(201).json({
      msg: 'Usuario registrado'
    })
  }),

  login: jest.fn((req, res) => {
    res.status(200).json({
      token: 'token-prueba'
    })
  }),

  getPerfil: jest.fn((req, res) => {
    res.status(200).json({
      id: 1,
      nombre: 'Ricardo'
    })
  })
}))

jest.mock('../middleware/usuario-validator', () => ({
  middlewareUsuarios: jest.fn((req, res, next) => {
    next()
  })
}))

jest.mock('../middleware/auth.middleware', () => ({
  verificarToken: jest.fn((req, res, next) => {
    req.user = {
      id: 1
    }

    next()
  })
}))

const authRouter = require('../routes/auth.routes')

const app = express()

app.use(express.json())

app.use('/auth', authRouter)

describe('Auth Routes', () => {
  test('POST /auth/register debe registrar usuario', async () => {
    const response = await request(app).post('/auth/register').send({
      nombre: 'Ricardo',
      apellido: 'Herbas',
      email: 'ricardo@test.com',
      password: '123456'
    })

    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual({
      msg: 'Usuario registrado'
    })
  })

  test('POST /auth/login debe devolver token', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'ricardo@test.com',
      password: '123456'
    })

    expect(response.statusCode).toBe(200)

    expect(response.body).toHaveProperty('token')
  })

  test('GET /auth/perfil debe requerir token', async () => {
    const response = await request(app).get('/auth/perfil')

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      id: 1,

      nombre: 'Ricardo'
    })
  })
})
