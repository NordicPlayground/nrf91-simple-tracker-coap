FROM node:19-alpine

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 80 443 6600
CMD [ "node", "index.js" ]