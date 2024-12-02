# FROM node:20 as build
# WORKDIR /app

# COPY package.json package-lock.json ./
# RUN npm install --no-audit

# COPY public/ public/
# COPY src/ src/
# COPY . .

# RUN npm run build

# FROM nginx:stable-alpine
# COPY --from=build /app/build /usr/share/nginx/html

# EXPOSE 80 443

# CMD ["nginx", "-g", "daemon off;"]

FROM node:20 as build
WORKDIR /app

# Copie des fichiers package.json et installation des dépendances
COPY package.json package-lock.json ./
RUN npm install --no-audit

# Copie des fichiers de l'application
COPY public/ public/
COPY src/ src/
COPY .env ./
COPY . .

# Construction de l'application
RUN npm run build

# Phase de production
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Exposition des ports
EXPOSE 80 443

# Commande par défaut pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
