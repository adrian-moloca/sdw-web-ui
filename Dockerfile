FROM iamfreee/docker-nginx-static-spa:latest
COPY ./build /var/www/html
EXPOSE 80
RUN chown nginx:nginx /var/www/html/ -R