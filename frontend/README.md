# Frontend — FinanzasApp

React + Vite. Consume la API REST del backend con JWT.

## Estructura

```
src/
├── context/
│   └── AuthContext.jsx       # Estado global de autenticación + JWT
├── services/
│   └── api.js                # Axios con interceptores (token + 401)
├── pages/
│   ├── Login.jsx / .css
│   ├── Register.jsx / .css
│   ├── Auth.module.css       # Estilos compartidos Login/Register
│   ├── Dashboard.jsx / .css
├── components/
│   ├── Navbar.jsx / .css
│   ├── BalanceCards.jsx / .css
│   ├── TransaccionList.jsx / .css
│   └── TransaccionForm.jsx / .css
└── App.jsx                   # Router + rutas protegidas
```

## Instalación

```bash
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`.
Las llamadas a `/api/*` son redirigidas al backend en `http://localhost:3000` via el proxy de Vite.

## Requisitos

El backend debe estar corriendo en el puerto 3000 con las variables de entorno configuradas.
