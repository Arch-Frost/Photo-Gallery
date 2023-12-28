FROM node:alpine

WORKDIR /usr/app/log-serv

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]