# "bare" base image with just our source files
# which only has Node runtime - not even NPM!
FROM mhart/alpine-node:base-6 as BASE
WORKDIR /dist
COPY . .

# test image installs development dependencies
# and runs testing commands
# derived from Node image that _includes_ NPM
FROM mhart/alpine-node:6 as INSTALL
RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh
WORKDIR /dist
# Copy files _from_ BASE
# To avoid accidentally creating different
# testing environment from production
COPY --from=BASE /dist .
RUN npm i --only=prod

# final production image
FROM BASE as SERVER
EXPOSE 1337
CMD ["node", "server.js"]
