FROM ubuntu:bionic
LABEL maintainer="Sebastian Spreizer <spreizer@web.de>"

RUN apt-get update && apt-get install -y python3-pip
RUN python3 -m pip install --upgrade pip && \
    python3 -m pip install uwsgi

RUN export LC_CTYPE=C.UTF-8 && \
    python3 -m pip install -i https://test.pypi.org/simple/ nest-desktop==3.0.0.dev5

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["start", "-h 0.0.0.0"]
