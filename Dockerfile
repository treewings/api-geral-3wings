FROM node:14.15.0-alpine

RUN apk add --no-cache python g++ make

WORKDIR /app
COPY . .
EXPOSE 80
EXPOSE 3355
RUN yarn install --production

CMD ["node", "build/server.js"]
