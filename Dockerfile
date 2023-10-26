FROM node:20.8-alpine as builder
WORKDIR /app

COPY package*.json /app/
RUN npm i vite -g
RUN npm install --legacy-peer-deps --production
COPY . /app

RUN npm run build

FROM nginx:1.25.2-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
