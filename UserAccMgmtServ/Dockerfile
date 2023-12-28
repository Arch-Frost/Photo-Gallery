FROM node:alpine

WORKDIR /usr/app/user-acc-mgmt-serv

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]