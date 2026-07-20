const request = require('supertest');
const express = require('express');


jest.mock('../controllers/transaccion.controller', () => ({

  getAllTransacciones: jest.fn((req, res) => {
    res.status(200).json([
      {
        id:1,
        monto:1000,
        tipo:'ingreso'
      }
    ]);
  }),


  getTransaccionById: jest.fn((req, res) => {
    res.status(200).json({
      id:req.params.id,
      monto:500,
      tipo:'gasto'
    });
  }),


  getBalance: jest.fn((req, res) => {
    res.status(200).json({
      balance:'700.00',
      totalIngresos:'1000.00',
      totalGastos:'300.00'
    });
  }),


  postTransaccion: jest.fn((req, res) => {
    res.status(201).json({
      id:1,
      monto:req.body.monto
    });
  }),

  putTransaccion: jest.fn((req, res) => {
    res.status(200).json({
      msg:'Transacción actualizada'
    });
  }),


  deleteTransaccion: jest.fn((req, res) => {
    res.status(200).json({
      msg:'Transacción eliminada'
    });
  })

}));

jest.mock('../middleware/auth.middleware', () => ({

  verificarToken: jest.fn((req,res,next)=>{

    req.user = {
      id:1
    };

    next();

  })

}));


jest.mock('../middleware/transaccion-validator', () => ({

  middlewareTransaccion: jest.fn((req,res,next)=>{

    next();

  })

}));


const transaccionRouter = require('../routes/transaccion.routes');
const app = express();
app.use(express.json());
app.use('/transacciones', transaccionRouter);
describe('Transaccion Routes', () => {

  test('GET /transacciones debe obtener transacciones', async () => {

    const response = await request(app)
      .get('/transacciones');

    expect(response.statusCode)
      .toBe(200);

    expect(response.body)
      .toEqual([
        {
          id:1,
          monto:1000,
          tipo:'ingreso'
        }
      ]);

  });


  test('GET /transacciones/balance debe devolver balance', async () => {

    const response = await request(app)
      .get('/transacciones/balance');

    expect(response.statusCode)
      .toBe(200);

    expect(response.body)
      .toEqual({

        balance:'700.00',

        totalIngresos:'1000.00',

        totalGastos:'300.00'

      });
  });

  test('GET /transacciones/:id debe obtener una transacción', async () => {

    const response = await request(app)
      .get('/transacciones/1');

    expect(response.statusCode)
      .toBe(200);

    expect(response.body)
      .toEqual({

        id:'1',

        monto:500,

        tipo:'gasto'

      });
  });

  test('POST /transacciones debe crear una transacción', async () => {

    const response = await request(app)
      .post('/transacciones')
      .send({

        monto:300,

        fecha:'2026-01-01',

        descripcion:'Compra',

        tipo:'gasto',

        categoria_id:2

      });

    expect(response.statusCode)
      .toBe(201);

    expect(response.body)
      .toEqual({

        id:1,

        monto:300

      });
  });

  test('PUT /transacciones/:id debe actualizar una transacción', async () => {

    const response = await request(app)
      .put('/transacciones/1')
      .send({

        monto:500

      });

    expect(response.statusCode)
      .toBe(200);

    expect(response.body)
      .toEqual({

        msg:'Transacción actualizada'

      });
  });

  test('DELETE /transacciones/:id debe eliminar una transacción', async () => {

    const response = await request(app)
      .delete('/transacciones/1');

    expect(response.statusCode)
      .toBe(200);

    expect(response.body)
      .toEqual({

        msg:'Transacción eliminada'

      });
  });
});