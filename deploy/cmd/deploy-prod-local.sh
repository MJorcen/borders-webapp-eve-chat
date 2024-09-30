#!/bin/bash

BUILD_ID=14
image=ccr.ccs.tencentyun.com/borders-webapps/eve-admin:${BUILD_ID}

tyarn
tyarn run build:prod

docker build --platform=linux/amd64 . -t "$image"  -f deploy/docker/Dockerfile-run
docker push "$image"

kubectl --namespace webapps-prod set image deployment/eve-admin webapp="$image"

kubectl --namespace webapps-prod describe deployment/eve-admin
