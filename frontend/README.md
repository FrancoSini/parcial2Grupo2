# Frontend — FinanzasApp

Esta es la interfaz web del sistema de gestión financiera. Está desarrollada con **React** y **Vite**. Consume la API REST del backend para manejar los ingresos y gastos de los usuarios utilizando autenticación segura mediante JWT.

## Estructura del proyecto
```js
src/
├── context/
│   └── AuthContext.jsx       # Estado global de autenticación y manejo del token
├── services/
│   └── api.js                # Instancia de Axios con interceptores
├── pages/
│   ├── Login.jsx / .css      
│   ├── Register.jsx / .css   
│   ├── Auth.module.css       # Estilos compartidos para el login y registro
│   └── Dashboard.jsx / .css  
├── components/
│   ├── Navbar.jsx / .css
│   ├── BalanceCards.jsx / .css
│   ├── TransaccionList.jsx / .css
│   └── TransaccionForm.jsx / .css
├── index.css                 # Variables CSS globales
├── main.jsx                  
└── App.jsx                   # Enrutador principal
```
## Rutas y Seguridad
En App.jsx configuramos React Router para manejar la navegación. Implementamos dos componentes especiales para proteger el acceso a las vistas:

PrivateRoute: Envuelve al Dashboard. Revisa si hay una sesión activa y si no encuentra un usuario logueado lo redirige automáticamente al /login.

PublicRoute: Envuelve el login y el registro. Si un usuario ya tiene sesión en el navegador lo manda directo al Dashboard para que no vuelva a ver las pantallas de ingreso.

## Manejo de Estado (AuthContext)
Usamos la Context API de React para tener los datos del usuario disponibles en toda la aplicación sin necesidad de pasar props componente por componente.

### login(email, password)

Se encarga de la autenticación y de guardar la sesión en el navegador.

```JavaScript
const login = async (email, password) => {
  const { data } = await loginRequest({ email, password })
  localStorage.setItem('token', data.token)
  localStorage.setItem('user',  JSON.stringify(data.user))
  setUser(data.user)
}
```
Lógica: Llama al endpoint de login. Si las credenciales son correctas extrae el token y los datos del usuario para guardarlos en el localStorage. Esto permite que la sesión siga viva aunque el usuario cierre la pestaña o recargue la página. Al final actualiza el estado user para que toda la interfaz se entere de que ingresó alguien.

Conexión a la API y Tokens (api.js)
Toda la comunicación con el backend pasa por una instancia centralizada de Axios. Acá configuramos dos interceptores clave para manejar la seguridad de forma automática.

### Interceptor de Peticiones (Request)

```JavaScript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```
Lógica: Antes de que salga cualquier petición HTTP busca el token guardado. Si lo encuentra lo inyecta directamente en los headers bajo el formato Bearer <token>. Así evitamos tener que mandar el token a mano en cada llamada que hacemos desde los componentes.

### Interceptor de Respuestas (Response)

```JavaScript
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
```
Lógica: Revisa todas las respuestas que llegan del servidor. Si el backend nos rechaza una acción con un error 401 (token vencido o inválido) este código limpia el localStorage borrando los datos de sesión y fuerza una redirección a la pantalla de login.

Lógica del Dashboard
El Dashboard.jsx es el panel principal de la aplicación. Tiene algunas optimizaciones importantes para que funcione rápido.

## Carga concurrente de datos
Para traer la información inicial usamos un Promise.all que dispara las llamadas de transacciones, balance y categorías al mismo tiempo. Esto reduce mucho los tiempos de carga frente a hacer llamadas secuenciales esperando que termine una para arrancar la otra.

## Filtros en memoria (useMemo)
Cuando el usuario usa la barra de filtros (por fecha, tipo o categoría) no le volvemos a pegar a la base de datos. Usamos el hook useMemo de React para filtrar la lista completa que ya tenemos guardada en el estado local. El resultado es instantáneo y le ahorra trabajo de procesamiento al backend.

## Estilos (CSS Modules)
El frontend no utiliza librerías externas de diseño pesado. Está armado con CSS puro utilizando el enfoque de CSS Modules.
Cada componente tiene su propio archivo de estilos (ejemplo Dashboard.module.css). Vite se encarga de compilar esto generando nombres de clases únicos para evitar colisiones y que los estilos de un componente no rompan la vista de otro. Además tenemos un index.css global con variables para mantener los colores y fuentes unificados.

## Instalación y Arranque
Para correr el cliente necesitás posicionarte en la carpeta del frontend e instalar las dependencias de Node.

Instalá las librerías:

```npm install```
Levantá el servidor de desarrollo:

```npm run dev```

La aplicación va a correr por defecto en http://localhost:5173.
Tené en cuenta que para que todo funcione el backend debe estar corriendo en el puerto 3000 de tu máquina. Las llamadas asíncronas que van hacia /api/* se redirigen solas al backend gracias a la configuración del proxy interno de Vite.