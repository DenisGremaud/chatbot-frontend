FROM node:20 as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --no-audit

COPY public/ public/
COPY src/ src/
COPY . .

ARG REACT_APP_BACKEND_URL
ARG GENERATE_SOURCEMAP

RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]