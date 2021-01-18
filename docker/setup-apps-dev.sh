kompose convert --provider=openshift --out build/

oc project nest-desktop-v3
oc delete is,dc,svc,configMap,route nest-desktop nest-server

# oc create -f nest-desktop-imagestream.yaml
# oc create -f nest-desktop-deploymentconfig.yaml
# oc create -f nest-desktop-service.yaml
# oc create route edge --hostname='nest-desktop-v3.apps-dev.hbp.eu' --port='8000' --service='nest-desktop'

oc apply -f ./build/nest-server-imagestream.yaml
oc apply -f ./build/nest-server-deploymentconfig.yaml
oc apply -f ./build/nest-server-service.yaml
oc create route edge --hostname='nest-server.apps-dev.hbp.eu' --service='nest-server'
