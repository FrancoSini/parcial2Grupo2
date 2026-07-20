jest.mock('../dist/models/categoria.model', () => ({
  CategoriaModel: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn()
  }
}));


const {
  getAllCategorias,
  getCategoriaById,
  postCategoria,
  putCategoria,
  deleteCategoria
} = require('../controllers/categoria.controller');


const { CategoriaModel } = require('../dist/models/categoria.model');


describe('Categoria Controller', () => {


  test('Debe obtener todas las categorías', async () => {

    CategoriaModel.findAll.mockResolvedValue([
      {
        id: 1,
        nombre: 'Mamíferos'
      },
      {
        id: 2,
        nombre: 'Aves'
      }
    ]);


    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();


    await getAllCategorias(req, res, next);


    expect(CategoriaModel.findAll)
      .toHaveBeenCalled();


    expect(res.status)
      .toHaveBeenCalledWith(200);


    expect(res.json)
      .toHaveBeenCalledWith([
        {
          id: 1,
          nombre: 'Mamíferos'
        },
        {
          id: 2,
          nombre: 'Aves'
        }
      ]);

  });



  test('Debe obtener una categoría por ID', async () => {

    CategoriaModel.findByPk.mockResolvedValue({
      id: 1,
      nombre: 'Mamíferos'
    });


    const req = {
      params: {
        id: 1
      }
    };


    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };


    const next = jest.fn();


    await getCategoriaById(req, res, next);


    expect(CategoriaModel.findByPk)
      .toHaveBeenCalledWith(1);


    expect(res.status)
      .toHaveBeenCalledWith(200);


    expect(res.json)
      .toHaveBeenCalledWith({
        id: 1,
        nombre: 'Mamíferos'
      });

  });



  test('Debe crear una categoría nueva', async () => {

    CategoriaModel.create.mockResolvedValue({
      id: 3,
      nombre: 'Reptiles'
    });


    const req = {
      body: {
        nombre: 'Reptiles'
      }
    };


    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };


    const next = jest.fn();


    await postCategoria(req, res, next);


    expect(CategoriaModel.create)
      .toHaveBeenCalledWith({
        nombre: 'Reptiles'
      });


    expect(res.status)
      .toHaveBeenCalledWith(201);


    expect(res.json)
      .toHaveBeenCalledWith({
        id: 3,
        nombre: 'Reptiles'
      });

  });



  test('Debe eliminar una categoría existente', async () => {

    const categoriaMock = {
      id: 1,
      nombre: 'Mamíferos',
      destroy: jest.fn()
    };


    CategoriaModel.findByPk.mockResolvedValue(categoriaMock);


    const req = {
      params: {
        id: 1
      }
    };


    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };


    const next = jest.fn();


    await deleteCategoria(req, res, next);


    expect(CategoriaModel.findByPk)
      .toHaveBeenCalledWith(1);


    expect(categoriaMock.destroy)
      .toHaveBeenCalled();


    expect(res.status)
      .toHaveBeenCalledWith(200);


    expect(res.json)
      .toHaveBeenCalledWith({
        msg: 'Categoría 1 eliminada correctamente'
      });

  });


});