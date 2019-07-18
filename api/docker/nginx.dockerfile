FROM nginx:latest

LABEL Luann Rodrigo

COPY /docker/config/nginx.conf /etc/nginx/nginx/nginx.conf

EXPOSE 80 443

ENTRYPOINT [ "nginx" ]
#parametros extras para o entrypoint
CMD ["-g", "daemon off;"]