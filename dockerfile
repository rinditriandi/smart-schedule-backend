FROM node:22.5.0-bullseye

ENV TZ="Asia/Jakarta"

WORKDIR /app

COPY . ./

RUN npm install

CMD ["npm", "start"]