FROM nginx:alpine
RUN ls -lrta /usr/share/nginx/html/
RUN rm -rf /usr/share/nginx/html/*
COPY /dist/out/ /usr/share/nginx/html/
RUN ls -lrta /usr/share/nginx/html/
#FROM node:14-alpine as build-stage
#WORKDIR /app
#COPY package*.json /app/
#RUN npm install
#COPY ./ /app/
#ARG configuration=production
#RUN npm install -g @angular/cli@latest
#RUN npm install --save @capacitor/core @capacitor/cli
#RUN node_modules/.bin/ng build --prod --output-path=./dist/out
#3FROM nginx:1.19
#COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html/
