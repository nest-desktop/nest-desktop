FROM nestsim/nest:3.0
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

COPY ./entrypoint.sh /usr/local/bin/

EXPOSE 5000
ENTRYPOINT ["entrypoint.sh"]
CMD ["nest-server", "start", "-h 0.0.0.0", "-o"]
