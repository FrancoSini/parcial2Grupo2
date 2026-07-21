# PARCIAL N°2:

## API Sistema de Gestión Financiera y Autenticación

Este proyecto es una **API REST** desarrollada para llevar el control de los movimientos de ingresos y gastos de una organización. Permite administrar usuarios, categorías y transacciones de forma ordenada y centralizada

### ¿Qué hace la aplicación?

- **Gestión Financiera (CRUD):** Permite crear, consultar, actualizar y eliminar registros de transacciones monetarias y sus respectivas clasificaciones por categorías.
- **Persistencia Relacional:** Almacena de forma segura toda la información en una base de datos relacional con **PostgreSQL**, utilizando el ORM **Sequelize** para el mapeo de los datos.
- **Seguridad (JWT):** Cuenta con un sistema completo de registro y login de usuarios protegido con **JSON Web Tokens (JWT)**. Esto asegura el perfil del usuario y bloquea el acceso a las rutas del negocio para personas no autenticadas.
- **Estructura y Tipado:** Utiliza **TypeScript** para definir las interfaces, modelos y el tipado estricto del sistema de datos.
- **Infraestructura con Docker:** Todo el entorno está automatizado con **Docker** y **Docker-Compose**, lo que levanta simultáneamente la base de datos, el backend y un proxy inverso con Caddy para que el sistema funcione en cualquier computadora.

## GRUPO N°2:

- Franco Sinigaglia
- Joaquin Pignotti
- Lucia Aguero
- Mateo Benjamin Barrera
- Ricardo Herbas
- Ignacio Painenahuel Luna

## Tecnologías utilizadas: Node.js, Express, TypeScript, PostgreSQL, Sequelize, Docker, Docker-Compose, JWT, Bcrypt, Postman, Caddy, React, Vite, Axios, React Router

---

## Estructura del proyecto

```
/proyecto
│
├── .dockerignore
├── .gitignore
├── .env.example              # Variables de entorno de referencia para la infraestructura
├── Dockerfile                # Configuración de compilación e imagen de la API
├── docker-compose.yml        # Orquestador de contenedores (App, DB, pgAdmin, Proxy)
├── package.json              # Manifiesto de dependencias y scripts de compilación
├── tsconfig.json             # Configuración del compilador de TypeScript
├── app.js                    # Archivo de arranque inicial de la aplicación
├── Caddyfile                 # Configuración del servidor y proxy inv
│
├── /core
│   └── server.js             # Clase Server contenedora de middlewares y rutas globales
│
├── /config
│   └── conexion.ts           # Configuración del ORM Sequelize y conexión a PostgreSQL
│
├── /interfaces               # Definición de tipos de datos y contratos
│   ├── categoria.interface.ts
│   ├── transaccion.interface.ts
│   └── usuario.interface.ts
│
├── /models                   # Modelos relacionales y hooks de base de datos
│   ├── n-index.models.ts     # Exportador centralizado de modelos
│   ├── categoria.model.ts
│   ├── transaccion.model.ts
│   └── usuario.model.ts
│
├── /middleware               # Interceptores de validación de esquemas y guardianes de JWT
│   ├── auth.middleware.js
│   ├── categoria-validator.js
│   ├── transaccion-validator.js
│   ├── usuario-validator.js
│   └── error-handler.js       # Capturador y formateador de excepciones globales
│
├── /routes                   # Definición y mapeo de enrutadores HTTP (Endpoints)
│   ├── auth.routes.js
│   ├── categoria.routes.js
│   ├── transaccion.routes.js
│   └── usuario.routes.js
│
└── /frontend                 # Cliente web (React + Vite) que consume la API
    ├── Dockerfile             # Build de producción servido a través de Caddy
    ├── package.json
    ├── README.md              # Documentación específica del frontend
    └── /src
        ├── /context           # Estado global de autenticación (AuthContext)
        ├── /services          # Instancia de Axios y llamadas a la API
        ├── /pages             # Login, Register, Dashboard
        └── /components        # Navbar, BalanceCards, TransaccionForm, TransaccionList

```

---

## Lógica principal

El servidor se inicializa en `app.js` instanciando la clase `Server` estructurada en `./core/server.js`. La lógica de la aplicación se rige por una arquitectura desacoplada de responsabilidades (MVC):

1. **Conexión e Infraestructura:** El archivo `conexion.ts` se encarga de autenticar y levantar el pool de conexiones relacionales hacia la base de datos PostgreSQL, ejecutando una sincronización alterativa de tablas (`sync({ alter: true })`) de forma automática en el arranque
2. **Ciclo de Peticiones:** Las solicitudes HTTP entrantes impactan en los enrutadores alojados en `/routes`. Aquellas rutas que modifican datos o son sensibles pasan por middlewares validadores de esquemas (`/middleware`), los cuales comprueban que los tipos de datos sean correctos; si se hallan inconsistencias, la petición es rechazada devolviendo un listado de errores formateados en un string uniforme
3. **Autenticación y Seguridad:** El guardián `auth.middleware.js` intercepta las rutas protegidas del negocio (Categorías y Transacciones). Este verifica la cabecera `Authorization` bajo el esquema `Bearer <token>`. Si la firma del JWT es válida con la clave secreta del entorno, decodifica los datos y añade la propiedad `req.user` para su libre uso en las capas inferiores, aislando el acceso de usuarios no autenticados
4. **Controladores y Persistencia:** Los controladores (`/controllers`) procesan las solicitudes asíncronas abstrayendo las interacciones de SQL mediante el mapeo relacional de los modelos de Sequelize. Todo el flujo crítico se encierra en bloques `try/catch` encauzando las excepciones mediante `next(error)` hacia un manejador de errores centralizado (`error-handler.js`), que intercepta problemas de la base de datos (como `SequelizeValidationError`) previniendo caídas imprevistas del servidor

---

## Metodología de Trabajo con Git y GitHub

Trabajamos bajo una metodología basada en **Git Flow** simplificado:

- La rama `main` quedó reservada para código que coincide con las entregas.
- Cada integrante desarrolló sus funcionalidades asignadas de forma aislada en sus respectivas ramas locales y remotas de características, enviando sus cambios mediante Pull Requests hacia la rama de desarrollo e integración global (dev)

---

## Dockerización del Entorno

Para garantizar la paridad absoluta entre desarrollo y producción, el entorno se virtualiza en contenedores aislados mediante **Docker** y se orquestan múltiples servicios en conjunto mediante **Docker-Compose**.

### Especificación del Servidor de Aplicaciones (`Dockerfile`)

```dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

db (PostgreSQL 17): Es el motor de la base de datos relacional. Se encarga de guardar toda la información del sistema de forma permanente dentro de una carpeta segura de la computadora

api (Node.js/Express): Es nuestro servidor backend (donde está la lógica del negocio). Está configurado para esperar de forma obligatoria que la base de datos (db) esté encendida y lista antes de arrancar a escuchar peticiones en el puerto 3000

pgadmin: Es una herramienta con interfaz gráfica web. Nos permite conectarnos visualmente a PostgreSQL para revisar las tablas, filas y columnas de la base de datos sin necesidad de usar la terminal

caddy: Es un servidor web que funciona como Proxy Inverso (el recepcionista del proyecto). Da la cara hacia el exterior, recibe las peticiones de los usuarios y las redirige de forma segura y ordenada hacia nuestra API

## Instalación y Puesta en Marcha

A continuación se detallan los pasos para levantar el proyecto de forma local, tanto usando Docker (recomendado, ya que replica el entorno completo) como de forma manual sin contenedores.

### Requisitos previos

- **Node.js** v20 o superior
- **Docker** y **Docker-Compose** (si se opta por la vía contenerizada)
- **PostgreSQL** (solo en caso de correr el proyecto sin Docker)

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd parcial2Grupo2
```

### 2. Configurar las variables de entorno

El proyecto incluye un archivo `.env.example` con todas las variables necesarias para levantar la base de datos, el backend y pgAdmin. Hay que duplicarlo y renombrarlo a `.env`:

```bash
cp .env.example .env
```

Luego completar (o dejar los valores por defecto) las credenciales de la base de datos, el puerto del servidor, la clave de JWT y las credenciales de pgAdmin.

### 3. Levantar el proyecto con Docker (recomendado)

Con Docker instalado y el `.env` configurado, alcanza con correr:

```bash
docker-compose up --build
```

Esto levanta simultáneamente 4 servicios:

- **db:** Base de datos PostgreSQL
- **api:** Backend de Node.js/Express, disponible en `http://localhost:3000`
- **caddy:** Proxy inverso, disponible en `http://localhost`
- **pgadmin:** Interfaz gráfica para explorar la base de datos

### 4. Levantar el proyecto de forma local (sin Docker)

Si se prefiere correr el backend directamente en la máquina (por ejemplo, para debuguear o correr los tests), hay que tener una instancia de PostgreSQL corriendo y con los datos del `.env` apuntando a ella. Luego:

```bash
npm install
```

Para levantar el servidor en modo desarrollo (con recarga automática vía `nodemon`):

```bash
npm run dev
```

Para compilar el proyecto de TypeScript a JavaScript y levantarlo en modo producción:

```bash
npm run build
npm start
```

### 5. Levantar el frontend de forma local

El cliente web vive en la carpeta `/frontend` y es un proyecto aparte (React + Vite), con su propio `package.json`. Para correrlo:

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173` y necesita que el backend esté corriendo en el puerto 3000 para poder hacer las peticiones a `/api/*`. Más detalles sobre la arquitectura del cliente (rutas protegidas, manejo de sesión, interceptores de Axios, etc.) están documentados en [`frontend/README.md`](./frontend/README.md).

> Con Docker no hace falta este paso: el servicio `caddy` ya compila el frontend y lo sirve automáticamente junto con la API.

### 6. Correr los tests

El proyecto cuenta con una suite de tests unitarios hecha con Jest y Supertest (ver sección de Testing y Pruebas Unitarias más abajo). Para ejecutarla:

```bash
npm test
```

Para generar el reporte de cobertura:

```bash
npm run coverage
```

> **Nota:** si al correr `npm test` o `npx jest` aparece un error del tipo _"jest no se reconoce como un comando"_, significa que la carpeta `node_modules` no está bien instalada (por ejemplo, si se copió/clonó de otra máquina). La solución es borrar `node_modules` y `package-lock.json` y volver a correr `npm install`.

---

## Frontend (Cliente Web)

Además de la API, el proyecto incluye un cliente web ubicado en `/frontend`, desarrollado con **React** y **Vite**, que consume los endpoints del backend para que un usuario pueda registrarse, iniciar sesión y gestionar sus ingresos/gastos desde una interfaz gráfica.

Puntos principales de su arquitectura:

- **Autenticación:** El token JWT se guarda en `localStorage` y se maneja de forma global mediante `AuthContext` (Context API de React)
- **Rutas protegidas:** Con `React Router` se implementan `PrivateRoute` (bloquea el Dashboard si no hay sesión) y `PublicRoute` (evita que un usuario logueado vuelva a ver el Login/Register)
- **Comunicación con la API:** Se centraliza en `services/api.js`, una instancia de Axios con interceptores que inyectan el token en cada petición y redirigen al login automáticamente ante una respuesta `401`
- **Dashboard:** Carga los datos de transacciones, balance y categorías en simultáneo (`Promise.all`) y filtra en memoria con `useMemo` para no recargar al backend con cada búsqueda
- **Estilos:** CSS Modules, sin librerías de diseño externas

La documentación completa de esta parte (estructura interna, lógica de cada archivo, cómo instalarlo y levantarlo) está en [`frontend/README.md`](./frontend/README.md).

---

## Mapa de Endpoints (Lista de Rutas)

#### Módulo de Autenticación y Usuarios (/api/auth)

🟡 POST /api/auth/register: Registra un nuevo usuario en la base de datos (usa la lógica de creación). Pasa por el validador estructural de usuarios. Estado: 201 Created.

🔵 POST /api/auth/login: Verifica las credenciales de acceso y retorna un JSON con el token de sesión JWT de 24 horas. Estado: 200 OK.

🟢 GET /api/auth/perfil: [RUTA PROTEGIDA] Retorna la información del perfil del usuario que posee la sesión activa sacando los datos de su token. Estado: 200 OK.

#### Módulo de Categorías (/api/categorias)

🟢 GET /api/categorias: [RUTA PROTEGIDA] Recupera la lista completa de todas las categorías disponibles. Estado: 200 OK.

🔵 GET /api/categorias/:id: [RUTA PROTEGIDA] Recupera los detalles de una única categoría por su ID primario. Estado: 200 OK.

🟡 POST /api/categorias: [RUTA PROTEGIDA] Crea una nueva categoría. Valida que el nombre sea de tipo string no vacío. Estado: 201 Created.

🟠 PUT /api/categorias/:id: [RUTA PROTEGIDA] Actualiza de forma parcial las propiedades de una categoría por su ID. Estado: 200 OK.

🔴 DELETE /api/categorias/:id: [RUTA PROTEGIDA] Remueve físicamente un registro de categoría de la base de datos. Estado: 200 OK.

#### Módulo de Transacciones (/api/transacciones)

🟢 GET /api/transacciones: [RUTA PROTEGIDA] Devuelve la lista histórica de todas las transacciones monetarias registradas en la DB. Estado: 200 OK.

🔵 GET /api/transacciones/:id: [RUTA PROTEGIDA] Devuelve una transacción específica localizándola por su ID numérico. Estado: 200 OK.

🟡 POST /api/transacciones: [RUTA PROTEGIDA] Da de alta un nuevo flujo financiero. Valida que el monto sea un número mayor a 0 y que el tipo sea estrictamente 'ingreso' o 'gasto'. Estado: 201 Created.

🟠 PUT /api/transacciones/:id: [RUTA PROTEGIDA] Permite modificar los datos de un movimiento existente identificándolo por su ID primario. Estado: 200 OK.

🔴 DELETE /api/transacciones/:id: [RUTA PROTEGIDA] Elimina definitivamente el movimiento monetario de la persistencia. Estado: 200 OK.

## Funcionalidades de los Controladores

## Módulo de Autenticación (auth.controller.js)

`register(req, res, next)`

Descripción: Controla la no duplicidad de identidad y da de alta un usuario entregándole inmediatamente su token inicial de sesión.

```JavaScript
const register = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password } = req.body

    const usuarioExistente = await UsuarioModel.findOne({ where: { email } })
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya se encuentra registrado.' })
    }

    const nuevoUsuario = await UsuarioModel.create({
      nombre,
      apellido,
      email,
      password
    })

    const token = generarToken(nuevoUsuario)

    return res.status(201).json({
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      },
      token
    })
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.body (nombre, apellido, email y password).

Valor de retorno: Objeto con los datos del usuario registrado y su correspondiente string de token JWT.

Lógica: Consulta de forma asíncrona la tabla mediante findOne. Si halla el correo, corta el flujo con un estado 400 Bad Request. En caso contrario, delega la inserción a UsuarioModel.create (donde el hook del ORM hashea el password antes de tocar la DB de forma invisible), firma el JWT y lo envía al cliente con un estado 201 Created.

`login(req, res, next)`

Descripción: Comprueba las credenciales del cliente (email y contraseña) y emite el token firmado si el acceso es válido.

```JavaScript
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const usuario = await UsuarioModel.findOne({ where: { email } })
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas.' })
    }

    const passwordValida = await usuario.verificarPassword(password)
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas.' })
    }

    const token = generarToken(usuario)

    return res.status(200).json({
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      },
      token
    })
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.body (email y password).

Valor de retorno: Objeto que contiene los datos del usuario y el JWT de sesión.

Lógica: Recupera la entidad por email. Si no existe, lanza un estado 401. Si existe, llama al método de instancia verificarPassword definido en el modelo TypeScript para desencriptar y contrastar de manera segura el string usando bcrypt. Si coincide, genera el token con expiración de 24 horas y responde 200 OK.

`getPerfil(req, res, next)`

Descripción: Retorna de forma segura la ficha del perfil del usuario autenticado actual.

```JavaScript
const getPerfil = async (req, res, next) => {
  try {
    const usuario = await UsuarioModel.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    })

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' })
    }

    return res.status(200).json(usuario)
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.user.id (inyectado previamente en el request por el middleware verificador de token).

Valor de retorno: Objeto del usuario autenticado excluyendo la contraseña.

Lógica: Ejecuta un findByPk en la base de datos usando el ID decodificado del JWT. Implementa una proyección selectiva de campos (attributes: { exclude: ['password'] }) para no exponer jamás el hash en el cliente. Devuelve un estado 200 OK.

## Módulo de Categorías (categoria.controller.js)

`getAllCategorias(req, res, next)`

Descripción: Trae del motor relacional el listado completo de categorías existentes en el sistema.

```JavaScript
const getAllCategorias = async (req, res, next) => {
  try {
    const categorias = await CategoriaModel.findAll()
    if (!categorias || categorias.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron categorías' })
    }
    return res.status(200).json(categorias)
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req, res, next.

Valor de retorno: Array con todas las categorías en formato JSON o mensaje de error.

Lógica: Implementa el método findAll() de Sequelize. Si la colección está vacía, corta devolviendo un estado 404 Not Found. Si contiene registros, responde con un 200 OK.

`getCategoriaById(req, res, next)`

Descripción: Localiza una única categoría mediante su clave primaria indexada.

```JavaScript
const getCategoriaById = async (req, res, next) => {
  try {
    const { id } = req.params
    const categoriaEncontrada = await CategoriaModel.findByPk(id)
    if (!categoriaEncontrada) {
      return res.status(404).json({ msg: `Categoría ${id} no encontrada` })
    }
    return res.status(200).json(categoriaEncontrada)
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.params.id (ID de la categoría enviado por la URL).

Valor de retorno: Objeto con los datos individuales de la categoría hallada.

Lógica: Usa findByPk(id) abstrayendo la cláusula WHERE de SQL. Si no se halla coincidencia, retorna un error de estado 404. Si existe, la muestra con un 200 OK.

`postCategoria(req, res, next)`

Descripción: Da de alta una nueva categoría de clasificación financiera.

```JavaScript
const postCategoria = async (req, res, next) => {
  try {
    const { nombre } = req.body
    const categoriaCreada = await CategoriaModel.create({ nombre })
    return res.status(201).json(categoriaCreada)
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.body (objeto JSON que contiene la propiedad nombre).

Valor de retorno: Objeto de la categoría recién persistida en la base de datos.

Lógica: Persiste el objeto en la tabla usando create() tras superar las validaciones estructurales previas y retorna un estado 211 Created.

`putCategoria(req, res, next)`

Descripción: Modifica el nombre de una categoría existente localizándola por ID.

```JavaScript
const putCategoria = async (req, res, next) => {
  try {
    const { id } = req.params
    const { nombre } = req.body
    const categoria = await CategoriaModel.findByPk(id)
    if (!categoria) {
      return res.status(404).json({ msg: `Categoría ${id} no encontrada` })
    }
    await categoria.update({ nombre })
    return res.status(200).json(categoria)
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.params.id y propiedades a actualizar enviadas en el req.body.

Valor de retorno: Objeto de la categoría modificada con sus datos actualizados.

Lógica: Primero valida la presencia del registro mediante findByPk. Si da nulo, responde con un 404. Si existe, invoca al método mutador update() de Sequelize y guarda físicamente los cambios en PostgreSQL, devolviendo la instancia con un estado 200 OK.

`deleteCategoria(req, res, next)`

Descripción: Borra definitivamente una categoría del sistema relacional.

```JavaScript
const deleteCategoria = async (req, res, next) => {
  try {
    const { id } = req.params
    const categoria = await CategoriaModel.findByPk(id)
    if (!categoria) {
      return res.status(404).json({ msg: `Categoría ${id} no encontrada` })
    }
    await categoria.destroy()
    return res.status(200).json({ msg: `Categoría ${id} eliminada correctamente` })
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.params.id.

Valor de retorno: JSON con un mensaje informativo de éxito.

Lógica: Al comprobar la existencia del registro por clave primaria, ejecuta el método de destrucción de instancia destroy(), lo que remueve la tupla física de PostgreSQL de manera asíncrona.

## Módulo de Transacciones (transaccion.controller.js)

`getAllTransacciones(req, res, next)`

Descripción: Recupera la totalidad de los movimientos monetarios de ingresos y gastos de la base de datos.

```JavaScript
const getAllTransacciones = async (req, res, next) => {
  try {
    const transacciones = await TransaccionModel.findAll()
    if (!transacciones || transacciones.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron transacciones' })
    }
    return res.status(200).json(transacciones)
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req, res, next.

Valor de retorno: Array completo con los objetos de todas las transacciones históricas registradas.

Lógica: Llama de forma asíncrona a TransaccionModel.findAll(). En caso de que la tabla esté limpia de datos, responde un estado 404, de lo contrario expone todo el vector con un 200 OK.

`getTransaccionById(req, res, next)`

Descripción: Devuelve la información de auditoría de un único movimiento de caja buscando por ID.

```JavaScript
const getTransaccionById = async (req, res, next) => {
  try {
    const { id } = req.params
    const transaccion = await TransaccionModel.findByPk(id)
    if (!transaccion) {
      return res.status(404).json({ msg: `Transacción ${id} no encontrada` })
    }
    return res.status(200).json(transaccion)
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.params.id.

Valor de retorno: El objeto relacional de la transacción consultada.

Lógica: Ejecuta la búsqueda directa por medio de findByPk. En caso de fallar en la localización de la fila, arroja un estado 404 Not Found.

`postTransaccion(req, res, next)`

Descripción: Inserta una nueva transacción vinculando de forma relacional un usuario con una categoría específica.

```JavaScript
const postTransaccion = async (req, res, next) => {
  try {
    const { monto, fecha, descripcion, tipo, usuario_id, categoria_id } = req.body
    const transaccionCreada = await TransaccionModel.create({
      monto,
      fecha,
      descripcion,
      tipo,
      usuario_id,
      categoria_id
    })
    return res.status(201).json(transaccionCreada)
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.body (monto, fecha, descripcion, tipo, usuario_id, categoria_id).

Valor de retorno: Objeto de la transacción creada.

Lógica: Mapea las propiedades del cuerpo de la petición. Al ejecutar create(), Sequelize valida a nivel relacional en el motor que existan las claves foráneas correspondientes. Si la integridad relacional es correcta, se persiste y responde un 201 Created.

`putTransaccion(req, res, next)`

Descripción: Modifica los parámetros financieros de un flujo monetario indexado.

```JavaScript
const putTransaccion = async (req, res, next) => {
  try {
    const { id } = req.params
    const { monto, fecha, descripcion, tipo, categoria_id } = req.body
    const transaccion = await TransaccionModel.findByPk(id)
    if (!transaccion) {
      return res.status(404).json({ msg: `Transacción ${id} no encontrada` })
    }
    await transaccion.update({ monto, fecha, descripcion, tipo, categoria_id })
    return res.status(200).json(transaccion)
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.params.id y variables opcionales de edición en el cuerpo.

Valor de retorno: Objeto modificado de la transacción guardada.

Lógica: Localiza la fila con findByPk. Al cerciorarse de su presencia en la DB, sobreescribe las propiedades y ejecuta un update(), guardando los datos y retornando un 200 OK.

`deleteTransaccion(req, res, next)`

Descripción: Remueve de forma definitiva una transacción financiera de las tablas históricas.

```JavaScript
const deleteTransaccion = async (req, res, next) => {
  try {
    const { id } = req.params
    const transaccion = await TransaccionModel.findByPk(id)
    if (!transaccion) {
      return res.status(404).json({ msg: `Transacción ${id} no encontrada` })
    }
    await transaccion.destroy()
    return res.status(200).json({ msg: `Transacción ${id} eliminada correctamente` })
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.params.id.

Valor de retorno: Mensaje indicando que el borrado físico concluyó con éxito.

Lógica: Verifica existencia de la clave primaria. Llama a la instrucción destroy() de la instancia, eliminando la tupla de PostgreSQL de forma contundente.

## Módulo de Soporte de Usuarios (usuario.controller.js)

`getAllUsuarios(req, res, next)`

Descripción: Retorna el listado plano de todos los usuarios registrados en el sistema global.

```JavaScript
const getAllUsuarios = async (req, res, next) => {
  try {
    const usuarios = await UsuarioModel.findAll()
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron usuarios' })
    }
    return res.status(200).json(usuarios)
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req, res, next.

Valor de retorno: Array con los objetos de todos los usuarios cargados.

Lógica: Realiza una llamada masiva a la tabla de usuarios mediante findAll(). Filtra colecciones vacías con estados 404, y expone los resultados usando un 200 OK.

`getUsuarioById(req, res, next)`

Descripción: Busca la ficha de registro de un único usuario mediante su ID dinámico de URL.

```JavaScript
const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params
    const usuarioEncontrado = await UsuarioModel.findByPk(id)
    if (!usuarioEncontrado) {
      return res.status(404).json({ msg: `No se pudo encontrar el usuario ${id}` })
    }
    return res.status(200).json(usuarioEncontrado)
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.params.id.

Valor de retorno: Instancia de datos del usuario localizado en la consulta SQL.

Lógica: Interroga al motor de PostgreSQL mediante findByPk(id). Si se encuentra el registro, se entrega inmediatamente formateado en JSON con un estado 200.

`postUsuario(req, res, next)`

Descripción: Registra un nuevo usuario de forma estándar (sin inyección de tokens directa).

```JavaScript
const postUsuario = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password } = req.body
    const usuarioCreado = await UsuarioModel.create({
      nombre,
      apellido,
      email,
      password
    })
    return res.status(201).json(usuarioCreado)
  } catch (error) {
    next(error)
  }
}
```

Parámetros: req.body (nombre, apellido, email, password).

Valor de retorno: Objeto del usuario creado de manera exitosa.

Lógica: Extrae los parámetros desde el cuerpo estructurado de la petición entrante, crea la fila mapeada mediante UsuarioModel.create e inserta los datos con un estado de éxito 201 Created.

### Funcionalidades de los Middlewares y Seguridad

(auth.middleware.js)

`generarToken(usuario) y verificarToken(req, res, next)`

Descripción: Este archivo intercepta las solicitudes para generar firmas criptográficas a los usuarios logueados y controlar la validez de los tokens en las rutas del negocio financiero.

```javascript
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_para_desarrollo'

const generarToken = (usuario) => {
  return jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, {
    expiresIn: '24h'
  })
}

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ error: 'No autorizado, token no provisto.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET)

    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' })
  }
}

module.exports = {
  generarToken,
  verificarToken
}
```

Lógica: \* generarToken toma el id y el email del usuario recién autenticado, firma el payload junto con la variable secreta JWT_SECRET y emite un token de acceso temporal con expiración exacta de 24 horas.

verificarToken actúa como un embudo de seguridad. Lee las cabeceras HTTP entrantes buscando el campo authorization. Si no viene bajo el estándar Bearer <token>, deniega el acceso con código 401. Si pasa la estructura, usa jwt.verify() para certificar la firma digital contra la clave del entorno. Si es exitoso, almacena los datos decodificados en la variable req.user para los controladores y llama a next() para dar vía libre a la petición

(error-handler.js)

`errorHandler(err, req, res, next)`

Descripción: Interceptor global de excepciones encargado de unificar las respuestas ante colapsos de red o de base de datos, previniendo la caída del proceso principal de Node.js

```javascript
const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]:', err.message || err)

  // Errores de Validación de Sequelize (Campos obligatorios vacíos o tipos erróneos)
  if (err.name === 'SequelizeValidationError') {
    const errores = err.errors.map((e) => e.message).join(', ')
    return res.status(400).json({ error: `Error de validación: ${errores}` })
  }

  // Errores de integridad relacional (Claves foráneas no existentes)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res
      .status(400)
      .json({
        error:
          'Violación de clave foránea. El ID referenciado de categoría o usuario no existe.'
      })
  }

  // Error genérico del sistema
  return res.status(500).json({
    error: 'Ocurrió un error inesperado en el servidor de base de datos.'
  })
}

module.exports = errorHandler
```

Lógica: El backend está suscrito a este manejador en server.js mediante la línea this.app.use(errorHandler). Al envolver los controladores en bloques try/catch, cualquier fallo de Postgres es capturado por el bloque catch y derivado con next(error). Este middleware lo intercepta, analiza si el fallo es de Sequelize (por campos inválidos o violación de FK), responde un JSON claro con estado 400 Bad Request y evita que la aplicación web colapse

## Testing y Pruebas Unitarias

Para garantizar la estabilidad y el correcto funcionamiento del sistema, el proyecto cuenta con una suite de pruebas automatizadas orientadas a los controladores y las rutas.

**Tecnologías utilizadas para el testing:**

- **Jest:** Framework principal para la estructuración y aserciones de las pruebas
- **Supertest:** Librería utilizada para simular peticiones HTTP hacia la aplicación Express sin necesidad de levantar el servidor

### Estrategia de Pruebas

El entorno de pruebas utiliza **Mocks** (simulaciones) para aislar las capas de la aplicación, evitando tocar la base de datos real o requerir un token válido durante la ejecución:

- En las pruebas de **Rutas**, se simulan (mockean) las respuestas de los controladores y del middleware de autenticación (`verificarToken`)
- En las pruebas de **Controladores**, se simulan los métodos del ORM Sequelize (`findAll`, `findByPk`, `findOne`, `create`, etc.) directamente sobre los modelos (`UsuarioModel` y `TransaccionModel`)

### Cobertura Actual

#### 1. Pruebas de Controladores (Lógica de Negocio)

Se verifica el comportamiento interno de los controladores ante casos de éxito:

- **Usuario Controller:** Valida que las funciones `getAllUsuarios`, `getUsuarioById`, `postUsuario`, `putUsuario` y `deleteUsuario` llamen correctamente a la base de datos y retornen los estados HTTP esperados (200 OK y 201 Created)
- **Transacción Controller:** Verifica el CRUD aislando las transacciones por el `usuario_id` correspondiente. Además, comprueba que el método `getBalance` calcule aritméticamente de forma correcta la resta entre el total de ingresos y gastos, devolviendo un objeto estructurado.

#### 2. Pruebas de Rutas (Endpoints)

Se testea que la API Express enrute las peticiones correctamente hacia sus controladores correspondientes:

- **Rutas de Usuarios (`/usuarios`):** Comprueba las solicitudes GET (colección e individual), POST, PUT y DELETE verificando los payloads de respuesta
- **Rutas de Transacciones (`/transacciones`):** Comprueba el CRUD estándar y el endpoint específico `/transacciones/balance`, asegurando que las respuestas estructurales de ingresos, gastos y balance coincidan con los esquemas esperados
