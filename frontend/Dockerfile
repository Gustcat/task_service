FROM node:24-alpine

WORKDIR /front

COPY frontend/package*.json ./
COPY .env .

RUN npm ci

COPY frontend/ .

RUN npm run build

# Используем nginx для сервинга статических файлов
FROM nginx:alpine
COPY --from=0 /front/dist /usr/share/nginx/html

# Копируем кастомный конфиг nginx, если нужен (опционально)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
