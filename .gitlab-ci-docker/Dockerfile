# nginx state for serving content
FROM nginx:stable
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Add default to available sites
COPY ./docker/nginx-default.conf /etc/nginx/conf.d/default.conf

# Copy app from build
COPY ./nest_desktop/app/ .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
