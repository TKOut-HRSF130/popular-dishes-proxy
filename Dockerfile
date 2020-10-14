FROM node:12.18.4

RUN mkdir -p /src/app

WORKDIR /src/app

COPY . /src/app

RUN npm install

EXPOSE 80

CMD ["npm", "start"]