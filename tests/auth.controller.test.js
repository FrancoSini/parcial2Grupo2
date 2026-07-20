jest.mock('../dist/models/usuario.model', () => ({
  UsuarioModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  }
}))

jest.mock('../middleware/auth.middleware', () => ({
  generarToken: jest.fn(() => 'token-prueba')
}))

const { register } = require('../controllers/auth.controller')
const { UsuarioModel } = require('../dist/models/usuario.model')
const { generarToken } = require('../middleware/auth.middleware')

describe('Auth Controller - Register', () => {
  test('Debe registrar un usuario nuevo', async () => {
    UsuarioModel.findOne.mockResolvedValue(null)

    UsuarioModel.create.mockResolvedValue({
      id: 1,
      nombre: 'Ricardo',
      apellido: 'Herbas',
      email: 'ricardo@test.com'
    })

    const req = {
      body: {
        nombre: 'Ricardo',
        apellido: 'Herbas',
        email: 'ricardo@test.com',
        password: '123456'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    const next = jest.fn()

    await register(req, res, next)

    expect(UsuarioModel.findOne).toHaveBeenCalled()

    expect(UsuarioModel.create).toHaveBeenCalled()

    expect(generarToken).toHaveBeenCalled()

    expect(res.status).toHaveBeenCalledWith(201)
  })
})
