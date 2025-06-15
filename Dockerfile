FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x run.sh

CMD ["node", "app.js"]
