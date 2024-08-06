# Utilizar una imagen Node.js de base con la versión 18 de Alpine Linux
FROM node:18-alpine as build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de configuración
COPY package*.json ./

RUN npm i

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Utilizar una imagen Nginx alpine para la fase de producción
FROM nginx:alpine

# Copiar los archivos de producción generados en la fase de construcción
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar la configuración Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Exponer el puerto
EXPOSE 3003

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]