FROM node:22.12.0-alpine

WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn prod
EXPOSE 3000

CMD ["yarn", "run:prod"]
