Setup docker image with custom port for nest-server 

```
docker build -f ./nest-desktop-custom-port.Dockerfile -t nest-desktop-custom-port .
```

Start docker container
```
docker run -it -p 7000:5000 -p 7001:8000 nest-desktop-custom-port
```

Go to ```http://localhost:7001```

