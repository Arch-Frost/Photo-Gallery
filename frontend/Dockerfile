FROM node:alpine
ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /usr/app/frontend-serv
COPY ./package.json ./
RUN npm install
COPY ./ ./
CMD [ "npm","start" ]