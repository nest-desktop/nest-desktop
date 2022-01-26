# nginx state for serving content
FROM nginx:stable-alpine
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

# Add default to available sites
COPY ./docker/nginx-default.conf /etc/nginx/conf.d/default.conf

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy app from build
COPY ./nest_desktop/app/ /usr/share/nginx/html/

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
