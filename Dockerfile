# since the node app needs to talk to the container running prometheus we also run this in a conatiner and expose the port in same network

FROM node:20

# create app dir
WORKDIR /usr/src/app


# install packages after copying the package json

COPY package*.json ./

RUN npm install

# bundle the app using tsc -b but just copying dist also here
COPY . .

EXPOSE 3000
CMD [ "node", "dist/index.js" ]
