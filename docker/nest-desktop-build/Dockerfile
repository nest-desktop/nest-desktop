# nginx state for serving content
FROM nginx:stable-alpine
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

RUN apk add --no-cache jq bash

# Add default to available sites
COPY ./docker/nest-desktop-build/nginx-default.conf /etc/nginx/conf.d/default.conf

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built app from the build folder to the NGINX serve folder
COPY ./nest_desktop/app /usr/share/nginx/html/

# Run nginx as non-root
RUN chmod -R 777 /usr/share/nginx/html/assets && \
    chmod -R 777 /var/cache/nginx && \
    touch /var/run/nginx.pid && \
    chmod -R 777 /var/run/nginx.pid

COPY ./docker/nest-desktop-build/workspaces /usr/local/bin/workspaces
RUN chmod +x -R /usr/local/bin/workspaces

# Copy entrypoint.sh and make it executable
COPY ./docker/nest-desktop-build/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 54286

# Define the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]
