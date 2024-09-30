#!/bin/bash

BUILD_ID=dev
image=ccr.ccs.tencentyun.com/borders-webapps/eve-chat:${BUILD_ID}

yarn
yarn run build:dev
docker build . -t "$image"  -f deploy/docker/Dockerfile-run

#docker stop eve-admin || true && docker rm eve-admin || true
docker run -d -p 13000:3000  --name webapps-eve-chat-dev  "$image"



#docker rmi $(docker images | grep "none" | awk '{print $3}')  & echo clear
# docker run -d  -v /data/job_log:/data/job_log  --name funni-job-dev -w /job --entrypoint ./job  ${image}


#docker rmi -f  $(docker images | grep "funni" | awk '{print $3}')  & echo clear


# docker system prune -a
# docker system df -v
# docker rm $(docker ps -q -f status=exited)
# docker rm $(docker ps -q -f status=created)
