jest.mock('../dist/models/transaccion.model', () => ({
  TransaccionModel: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

const {
  getAllTransacciones,
  getTransaccionById,
  getBalance,
  postTransaccion,
  putTransaccion,
  deleteTransaccion
} = require('../controllers/transaccion.controller');


const { TransaccionModel } = require('../dist/models/transaccion.model');

describe('Transaccion Controller', () => {

  test('Debe obtener todas las transacciones del usuario', async () => {

    TransaccionModel.findAll.mockResolvedValue([
      {
        id: 1,
        monto: 1000,
        tipo: 'ingreso'
      }
    ]);

    const req = {
      user: {
        id: 1
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getAllTransacciones(req, res, jest.fn());

    expect(TransaccionModel.findAll)
      .toHaveBeenCalledWith({
        where: {
          usuario_id: 1
        }
      });

    expect(res.status)
      .toHaveBeenCalledWith(200);

  });

  test('Debe obtener una transacción por ID', async () => {

    TransaccionModel.findOne.mockResolvedValue({
      id: 1,
      monto: 500,
      tipo: 'gasto'
    });

    const req = {
      params: {
        id: 1
      },
      user: {
        id: 1
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getTransaccionById(req, res, jest.fn());

    expect(TransaccionModel.findOne)
      .toHaveBeenCalledWith({
        where: {
          id: 1,
          usuario_id: 1
        }
      });

    expect(res.status)
      .toHaveBeenCalledWith(200);

  });

  test('Debe crear una transacción nueva', async () => {

    TransaccionModel.create.mockResolvedValue({
      id: 1,
      monto: 300,
      tipo: 'gasto',
      usuario_id: 1
    });

    const req = {

      body: {
        monto: 300,
        fecha: '2026-01-01',
        descripcion: 'Compra',
        tipo: 'gasto',
        categoria_id: 2
      },

      user: {
        id: 1
      }

    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await postTransaccion(req,res,jest.fn());

    expect(TransaccionModel.create)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          monto:300,
          tipo:'gasto',
          usuario_id:1,
          categoria_id:2
        })
      );

    expect(res.status)
      .toHaveBeenCalledWith(201);

  });

  test('Debe eliminar una transacción existente', async () => {

    const transaccionMock = {

      id:1,

      destroy: jest.fn()

    };

    TransaccionModel.findOne.mockResolvedValue(transaccionMock);

    const req = {

      params:{
        id:1
      },

      user:{
        id:1
      }
    };

    const res = {

      status: jest.fn().mockReturnThis(),

      json: jest.fn()

    };

    await deleteTransaccion(req,res,jest.fn());

    expect(transaccionMock.destroy)
      .toHaveBeenCalled();

    expect(res.status)
      .toHaveBeenCalledWith(200);

  });

  test('Debe calcular correctamente el balance', async () => {

    TransaccionModel.findAll.mockResolvedValue([

      {
        tipo:'ingreso',
        monto:'1000'
      },

      {
        tipo:'gasto',
        monto:'300'
      }
    ]);

    const req = {

      user:{
        id:1
      }
    };

    const res = {

      status: jest.fn().mockReturnThis(),

      json: jest.fn()

    };

    await getBalance(req,res,jest.fn());

    expect(res.status)
      .toHaveBeenCalledWith(200);

    expect(res.json)
      .toHaveBeenCalledWith({

        balance:'700.00',

        totalIngresos:'1000.00',

        totalGastos:'300.00'

      });
  });
});