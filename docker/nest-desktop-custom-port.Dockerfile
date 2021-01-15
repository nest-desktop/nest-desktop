FROM babsey/nest-desktop:latest
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

COPY ./nest-server.json /usr/local/lib/python3.6/dist-packages/nest_desktop/app/assets/config/nest-server/

ENTRYPOINT ["/home/nest/entrypoint.sh"]
