FROM node:alpine

WORKDIR /usr/app/storage-mgmt-serv

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]