FROM nestsim/nest:3.0
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 5000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["0.0.0.0:5000"]
