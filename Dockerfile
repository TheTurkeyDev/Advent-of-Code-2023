# pull official base image
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ ./

EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
