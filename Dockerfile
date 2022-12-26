FROM node:16.0.0-alpine

ENV PORT PORT

WORKDIR /app
COPY ./package.json ./
RUN yarn install --pure-lockfile
COPY ./ ./

EXPOSE 3210
CMD ["yarn", "start"]