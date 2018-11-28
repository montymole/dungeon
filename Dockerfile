FROM  mhart/alpine-node:11 as INSTALL
RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

COPY ./dist ./dist
COPY ./package.json .
COPY ./package-lock.json .
RUN npm i --only=prod

# final production image
FROM  mhart/alpine-node:base-11  as SERVER
COPY --from=INSTALL /dist ./dist
COPY --from=INSTALL /node_modules ./node_modules
EXPOSE 8080
CMD ["node", "/dist/server.js"]
