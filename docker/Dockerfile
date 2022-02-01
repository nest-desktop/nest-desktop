# nginx state for serving content
FROM nginx:stable-alpine
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

RUN apk add --no-cache jq bash

# Add default to available sites
COPY ./docker/nginx-default.conf /etc/nginx/conf.d/default.conf

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built app from the build folder to the NGINX serve folder
COPY ./nest_desktop/app/ /usr/share/nginx/html/
RUN chmod 666 /usr/share/nginx/html/config.json

COPY ./docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]
