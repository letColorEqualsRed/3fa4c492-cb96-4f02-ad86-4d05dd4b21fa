FROM node:18.19.0

WORKDIR /app

COPY . .

RUN yarn
RUN npx tsc

EXPOSE 8080

ENTRYPOINT ["node", "dist/main.js"]