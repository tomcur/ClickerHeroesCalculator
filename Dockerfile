FROM node:15

WORKDIR /usr/src/app

RUN apt install git
RUN git clone https://github.com/tomcur/ClickerHeroesCalculator.git .
RUN git fetch origin pull/21/head:unity
RUN git checkout unity

RUN npm install
RUN npm install http-server

COPY startup.sh startup.sh
RUN chmod +x startup.sh

EXPOSE 8080
CMD [ "./startup.sh" ]
