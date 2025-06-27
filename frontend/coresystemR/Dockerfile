# Nodeイメージでビルド
FROM node:18-alpine3.19 AS build

# Update apk packages to reduce vulnerabilities
RUN apk update && apk upgrade

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 静的ファイルをnginxで配信
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]