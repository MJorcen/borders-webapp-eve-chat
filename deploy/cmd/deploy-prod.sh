#!/bin/bash

BUILD_ID=$1

image=ccr.ccs.tencentyun.com/borders-webapps/eve-admin:${BUILD_ID}

tyarn
tyarn run build:prod

docker build --platform=linux/amd64 . -t "$image"  -f deploy/docker/Dockerfile-run
if [ $? -ne 0 ]; then
    echo "=====failed====="
    exit 1
else
    echo "=====succeed====="
fi
docker push "$image"
if [ $? -ne 0 ]; then
    echo "=====failed====="
    exit 1
else
    echo "=====succeed====="
fi

kubectl --namespace webapps-prod set image deployment/eve-admin webapp="$image"
kubectl --namespace webapps-prod describe deployment/eve-admin

#docker push ccr.ccs.tencentyun.com/webapps/eve-admin:${BUILD_ID}

# docker system prune -a
# docker system df -v
# docker rm $(docker ps -q -f status=exited)
# docker rm $(docker ps -q -f status=created)
