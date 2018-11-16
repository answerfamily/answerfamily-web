FROM node:10
WORKDIR /app
EXPOSE 3000
ENTRYPOINT npm start

COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
RUN npm run build