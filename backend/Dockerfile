FROM node:alpine AS base

FROM base AS build

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --no-lockfile
COPY . .
RUN npm run build

FROM base AS production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/package-lock.json .

CMD ["sh", "-c", "npm run start:prod"]
