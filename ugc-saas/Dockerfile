FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
ENV DB_PATH=/data/app.db
EXPOSE 3000
CMD ["node", "server.js"]
