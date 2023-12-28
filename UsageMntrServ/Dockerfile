FROM node:alpine

WORKDIR /usr/app/usage-mntr-serv

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]