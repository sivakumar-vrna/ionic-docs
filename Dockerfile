FROM nginx:alpine
RUN ls -lrta /usr/share/nginx/html/
RUN rm -rf /usr/share/nginx/html/*
COPY /dist/out/  /usr/share/nginx/html/
RUN ls -lrta /usr/share/nginx/html/
