    const request = require('supertest');
    const express = require('express');


    jest.mock('../controllers/usuario.controller', () => ({

    getAllUsuarios: jest.fn((req, res) => {
        res.status(200).json([
        {
            id: 1,
            nombre: 'Ricardo',
            apellido: 'Herbas',
            email: 'ricardo@test.com'
        }
        ]);
    }),


    getUsuarioById: jest.fn((req, res) => {
        res.status(200).json({
        id: req.params.id,
        nombre: 'Ricardo'
        });
    }),


    postUsuario: jest.fn((req, res) => {
        res.status(201).json({
        id: 1,
        nombre: req.body.nombre
        });
    }),


    putUsuario: jest.fn((req, res) => {
        res.status(200).json({
        msg: 'Usuario actualizado'
        });
    }),


    deleteUsuario: jest.fn((req, res) => {
        res.status(200).json({
        msg: 'Usuario eliminado'
        });
    })

    }));



    jest.mock('../middleware/usuario-validator', () => ({

    middlewareUsuarios: jest.fn((req, res, next) => {

        next();

    })

    }));



    const usuarioRouter = require('../routes/usuario.routes');


    const app = express();

    app.use(express.json());

    app.use('/usuarios', usuarioRouter);



    describe('Usuario Routes', () => {



    test('GET /usuarios debe obtener usuarios', async () => {


        const response = await request(app)
        .get('/usuarios');


        expect(response.statusCode)
        .toBe(200);


        expect(response.body)
        .toEqual([
            {
            id:1,
            nombre:'Ricardo',
            apellido:'Herbas',
            email:'ricardo@test.com'
            }
        ]);


    });






    test('GET /usuarios/:id debe obtener un usuario', async () => {


        const response = await request(app)
        .get('/usuarios/1');


        expect(response.statusCode)
        .toBe(200);


        expect(response.body)
        .toEqual({

            id:'1',

            nombre:'Ricardo'

        });


    });






    test('POST /usuarios debe crear un usuario', async () => {


        const response = await request(app)
        .post('/usuarios')
        .send({

            nombre:'Ricardo',

            apellido:'Herbas',

            email:'ricardo@test.com',

            password:'123456'

        });



        expect(response.statusCode)
        .toBe(201);


        expect(response.body)
        .toEqual({

            id:1,

            nombre:'Ricardo'

        });


    });








    test('PUT /usuarios/:id debe actualizar usuario', async () => {


        const response = await request(app)
        .put('/usuarios/1')
        .send({

            nombre:'Ricardo actualizado'

        });



        expect(response.statusCode)
        .toBe(200);



        expect(response.body)
        .toEqual({

            msg:'Usuario actualizado'

        });


    });








    test('DELETE /usuarios/:id debe eliminar usuario', async () => {


        const response = await request(app)
        .delete('/usuarios/1');



        expect(response.statusCode)
        .toBe(200);



        expect(response.body)
        .toEqual({

            msg:'Usuario eliminado'

        });


    });



    });