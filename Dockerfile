FROM node:latest
# ADD package.json /usr/src/app/package.json
ADD package.json npm-shrinkwrap.json* /usr/src/app/package.json
WORKDIR /usr/src/app
RUN npm --unsafe-perm install
ADD app.js /usr/src/app/app.js
ADD bower.json /usr/src/app/bower.json
ADD cluster.js /usr/src/app/cluster.js
ADD views /usr/src/app/views
ADD templates /usr/src/app/templates
ADD scripts /usr/src/app/scripts
ADD styles /usr/src/app/styles
ADD routes /usr/src/app/routes
RUN mkdir /usr/src/app/uploads
RUN npm install -g bower
RUN bower install --allow-root
EXPOSE 8080
CMD [ "npm", "start" ]
