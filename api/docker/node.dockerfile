FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./

RUN apk update

RUN apk add \
    build-base \
    libtool \
    autoconf \
    automake \
    jq \
    openssh \
    python \
    yarn

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "run", "dev"]
