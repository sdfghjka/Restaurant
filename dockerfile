FROM node:18


WORKDIR /app


COPY package*.json ./


RUN npm install
RUN npm install -g nodemon

COPY . .

ENV HOST=0.0.0.0 PORT=3000

EXPOSE 3000


CMD ["npm", "run", "dev"]

