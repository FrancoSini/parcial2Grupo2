    jest.mock('../dist/models/usuario.model', () => ({
    UsuarioModel: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn()
    }
    }));


    const {
    getAllUsuarios,
    getUsuarioById,
    postUsuario,
    putUsuario,
    deleteUsuario
    } = require('../controllers/usuario.controller');


    const { UsuarioModel } = require('../dist/models/usuario.model');


    describe('Usuario Controller', () => {


    test('Debe obtener todos los usuarios', async () => {

        UsuarioModel.findAll.mockResolvedValue([
        {
            id: 1,
            nombre: 'Ricardo',
            apellido: 'Herbas',
            email: 'ricardo@test.com'
        }
        ]);


        const req = {};

        const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
        };


        await getAllUsuarios(req, res, jest.fn());


        expect(UsuarioModel.findAll)
        .toHaveBeenCalled();


        expect(res.status)
        .toHaveBeenCalledWith(200);


        expect(res.json)
        .toHaveBeenCalledWith([
            {
            id: 1,
            nombre: 'Ricardo',
            apellido: 'Herbas',
            email: 'ricardo@test.com'
            }
        ]);

    });




    test('Debe obtener un usuario por ID', async () => {


        UsuarioModel.findByPk.mockResolvedValue({
        id:1,
        nombre:'Ricardo',
        apellido:'Herbas'
        });



        const req = {

        params:{
            id:1
        }

        };


        const res = {

        status: jest.fn().mockReturnThis(),

        json: jest.fn()

        };



        await getUsuarioById(req,res,jest.fn());



        expect(UsuarioModel.findByPk)
        .toHaveBeenCalledWith(1);



        expect(res.status)
        .toHaveBeenCalledWith(200);


    });





    test('Debe crear un usuario nuevo', async () => {


        UsuarioModel.create.mockResolvedValue({

        id:1,

        nombre:'Ricardo',

        apellido:'Herbas',

        email:'ricardo@test.com'

        });



        const req = {

        body:{

            nombre:'Ricardo',

            apellido:'Herbas',

            email:'ricardo@test.com',

            password:'123456'

        }

        };



        const res = {

        status:jest.fn().mockReturnThis(),

        json:jest.fn()

        };



        await postUsuario(req,res,jest.fn());



        expect(UsuarioModel.create)
        .toHaveBeenCalledWith({

            nombre:'Ricardo',

            apellido:'Herbas',

            email:'ricardo@test.com',

            password:'123456'

        });



        expect(res.status)
        .toHaveBeenCalledWith(201);


    });






    test('Debe actualizar un usuario existente', async () => {


        const usuarioMock = {


        id:1,


        nombre:'Ricardo',


        apellido:'Herbas',


        email:'viejo@test.com',


        update:jest.fn()


        };



        UsuarioModel.findByPk.mockResolvedValue(usuarioMock);



        const req = {


        params:{

            id:1

        },


        body:{

            nombre:'Ricardo',

            apellido:'Nuevo',

            email:'nuevo@test.com',

            password:'123456'

        }

        };



        const res = {


        status:jest.fn().mockReturnThis(),

        json:jest.fn()


        };



        await putUsuario(req,res,jest.fn());



        expect(UsuarioModel.findByPk)
        .toHaveBeenCalledWith(1);



        expect(usuarioMock.update)
        .toHaveBeenCalledWith({

            nombre:'Ricardo',

            apellido:'Nuevo',

            email:'nuevo@test.com',

            password:'123456'

        });



        expect(res.status)
        .toHaveBeenCalledWith(200);


    });






    test('Debe eliminar un usuario existente', async () => {


        const usuarioMock = {


        id:1,


        destroy:jest.fn()


        };



        UsuarioModel.findByPk.mockResolvedValue(usuarioMock);



        const req = {


        params:{

            id:1

        }

        };



        const res = {


        status:jest.fn().mockReturnThis(),

        json:jest.fn()


        };



        await deleteUsuario(req,res,jest.fn());



        expect(UsuarioModel.findByPk)
        .toHaveBeenCalledWith(1);



        expect(usuarioMock.destroy)
        .toHaveBeenCalled();



        expect(res.status)
        .toHaveBeenCalledWith(200);



        expect(res.json)
        .toHaveBeenCalledWith({

            msg:'Usuario 1 eliminado correctamente'

        });


    });



    });