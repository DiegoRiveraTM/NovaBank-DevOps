FROM node:22.11.0-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

RUN groupadd -r appgroup && useradd -r -g appgroup appuser
USER appuser

EXPOSE 4000

CMD ["node", "dist/index.js"]