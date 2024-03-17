FROM node:latest 

WORKDIR /code/iD

COPY iD .

RUN npm i 
RUN npm run all

CMD [ "npm", "run", "start" ]
EXPOSE 8080