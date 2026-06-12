# Imagen base de Node
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto de la API
EXPOSE 3000

# Comando por defecto: ejecutar la versión compilada
CMD ["npm", "start"]
