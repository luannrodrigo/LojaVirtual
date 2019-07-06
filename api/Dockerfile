FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./
RUN apk add python
RUN yarn add
COPY . .

EXPOSE 3000

CMD ["yarn", "run", "dev"]
