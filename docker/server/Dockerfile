FROM node:latest 

WORKDIR /code/id-tagging-schema

COPY id-tagging-schema .

RUN npm i 

CMD [ "node", "index.js" ]
EXPOSE 3000