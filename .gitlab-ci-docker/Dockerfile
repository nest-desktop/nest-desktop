# nginx state for serving content
FROM nginx:stable
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy app from build
COPY ./nest_desktop/app/ .

# Add default to available sites
COPY ./docker/nginx/site.conf /etc/nginx/conf.d/default.conf
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

RUN touch /var/run/nginx.pid && \
  chown -R www-data:www-data /var/run/nginx.pid && \
  chown -R www-data:www-data /var/cache/nginx && \
  chmod -R 777 /var/cache/nginx

EXPOSE 8000

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
