FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node apps/web/package*.json ./apps/web/
COPY --chown=node:node packages/config/package*.json ./packages/config/

RUN npm install

COPY --chown=node:node . .

USER node

WORKDIR /usr/src/app/apps/web

CMD [ "npm", "run", "dev" ]
