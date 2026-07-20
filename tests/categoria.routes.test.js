const request = require('supertest');
const express = require('express');


jest.mock('../controllers/categoria.controller', () => ({

  getAllCategorias: jest.fn((req, res) => {
    res.status(200).json([
      {
        id:1,
        nombre:'Mamíferos'
      }
    ]);
  }),


  getCategoriaById: jest.fn((req, res) => {
    res.status(200).json({
      id:req.params.id,
      nombre:'Aves'
    });
  }),


  postCategoria: jest.fn((req, res) => {
    res.status(201).json({
      id:1,
      nombre:req.body.nombre
    });
  }),


  putCategoria: jest.fn((req, res) => {
    res.status(200).json({
      msg:'Categoría actualizada'
    });
  }),


  deleteCategoria: jest.fn((req, res) => {
    res.status(200).json({
      msg:'Categoría eliminada'
    });
  })

}));



jest.mock('../middleware/categoria-validator', () => ({

  middlewareCategoria: jest.fn((req,res,next)=>{

    next();

  })

}));



const categoriaRouter = require('../routes/categoria.routes');


const app = express();

app.use(express.json());

app.use('/categorias', categoriaRouter);



describe('Categoria Routes', () => {



  test('GET /categorias debe obtener categorías', async () => {


    const response = await request(app)
      .get('/categorias');



    expect(response.statusCode)
      .toBe(200);



    expect(response.body)
      .toEqual([
        {
          id:1,
          nombre:'Mamíferos'
        }
      ]);

  });






  test('GET /categorias/:id debe obtener una categoría', async () => {


    const response = await request(app)
      .get('/categorias/1');



    expect(response.statusCode)
      .toBe(200);



    expect(response.body)
      .toEqual({

        id:'1',

        nombre:'Aves'

      });


  });






  test('POST /categorias debe crear una categoría', async () => {


    const response = await request(app)
      .post('/categorias')
      .send({

        nombre:'Reptiles'

      });



    expect(response.statusCode)
      .toBe(201);



    expect(response.body)
      .toEqual({

        id:1,

        nombre:'Reptiles'

      });


  });







  test('PUT /categorias/:id debe actualizar categoría', async () => {


    const response = await request(app)
      .put('/categorias/1')
      .send({

        nombre:'Mamíferos actualizados'

      });



    expect(response.statusCode)
      .toBe(200);



    expect(response.body)
      .toEqual({

        msg:'Categoría actualizada'

      });


  });







  test('DELETE /categorias/:id debe eliminar categoría', async () => {


    const response = await request(app)
      .delete('/categorias/1');



    expect(response.statusCode)
      .toBe(200);



    expect(response.body)
      .toEqual({

        msg:'Categoría eliminada'

      });


  });



});