FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node apps/api/package*.json ./apps/api/
COPY --chown=node:node packages/config/package*.json ./packages/config/

RUN npm install

COPY --chown=node:node . .

USER node

WORKDIR /usr/src/app/apps/api

CMD [ "npm", "run", "dev" ]
