FROM node:16

WORKDIR /usr/src/app

RUN apt install git
RUN git clone https://github.com/tomcur/ClickerHeroesCalculator.git .

RUN yarn install
RUN yarn add http-server

RUN yarn build

EXPOSE 8080
ENTRYPOINT npx http-server dist
