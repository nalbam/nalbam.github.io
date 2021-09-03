---
layout: post
title: "Docker builx - multi architecture"
header:
  og_image: /assets/images/2020-05-20/workspaces.png
tags: [docker, buildx, multi, architecture, amd64, arm64]
---

우리가 사용하는 서버는 대부분 Intel core 기반의 `amd64` 에요. 따라서 대부분의 컨테이너 이미지는 amd64 기준으로 빌드되고 있어요. 하지만 프로세서는 arm 도 있고, 특히 AWS Graviton 2 는 `arm64` 코어를 기반으로 동작하고 되어있어요.

그래서 이미지를 멀티 아키텍처로 빌드하고, docker hub 와 aws ecr 에 push 하는 방법을 알아 보았어요.

## Docker Manifest

첫번째 방법은 `docker manifest` 를 이용하는 방법 이에요. docker build 를 각 arch 별로 진행하고, manifest 로 묶어주는 방법 이에요.

> 그런데 사실… 잘 안되더라고요…. 뭘 잘못 한거지…

```bash
# AMD64
$ docker build -t daangn/app:tag-amd64 --build-arg ARCH=amd64/ .
$ docker push daangn/app:tag-amd64

# ARM64
$ docker build -t daangn/app:tag-arm64 --build-arg ARCH=arm64/ .
$ docker push daangn/app:tag-arm64

$ docker manifest create daangn/app:tag-latest \
  --amend daangn/app:tag-amd64 \
  --amend daangn/app:tag-arm64

$ docker manifest push daangn/app:tag-latest
```

## Docker Buildx

두번째 방법은 `docker buildx` 를 이용하는 방법 이에요. buildx 는 별도로 설치 해줘야 해요.

이렇게 하면 push 까지 잘 되요.

```bash
$ docker buildx create --use --name daangn

$ docker buildx build \
  --push \
  --platform linux/amd64,linux/arm64 \
  --tag daangn/app:tag .

$ docker buildx imagetools inspect daangn/app:tag
```

## Install Buildx

아래 방법은 `Mac` 또는 `CircleCi` 에서 사용 할수 있는 방법 이에요.

바이너리 파일은 [여기](https://github.com/docker/buildx/releases)에서 버전 확인 및 다운 받아요.

```bash
mkdir -p ~/.docker/cli-plugins
url="https://github.com/docker/buildx/releases/download/v0.6.3/buildx-v0.6.3.darwin-amd64"
curl -sSL -o ~/.docker/cli-plugins/docker-buildx ${url}
chmod a+x ~/.docker/cli-plugins/docker-buildx
```

아래 방법은 docker builder 이미지 만들때 사용 하는 방법 이에요.

제 [Github Action](https://github.com/marketplace/actions/docker-push) 을 이렇게 구현 했어요.

```dockerfile
FROM docker
COPY --from=docker/buildx-bin /buildx /usr/libexec/docker/cli-plugins/docker-buildx
RUN docker buildx version
```

제가 Github Action 에서 사용하는 [Dockerfile](https://github.com/opspresso/builder/blob/master/Dockerfile) 이에요.

## Docker Push

[도커 허브](https://hub.docker.com/repository/docker/nalbam/sample-node/tags?page=1&ordering=last_updated)에 올라간 이미지에요.

![docker-hub](/assets/images/2021-09-03/docker-hub.png)

`AWS ECR `에 올라간 이미지 에요. (untagged 도 생기더라고요.)

![aws-ecr](/assets/images/2021-09-03/aws-ecr.png)

## Github Action

* https://github.com/marketplace/actions/docker-push

Docker Hub, AWS ECR (Private, Public), Quay.io, Github Package 에서 테스트 되었어요.

```yaml
name: Docker Push

on:
  push:
    branches:
      - main
      - master

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v1
        with:
          fetch-depth: 1

      - name: Build & Push to Docker Hub
        uses: opspresso/action-docker@master
        with:
          args: --docker
        env:
          USERNAME: ${{ secrets.DOCKER_USERNAME }}
          PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
          TAG_NAME: "v0.0.1"
          BUILDX: "true"

      - name: Build & Push to Quay.io
        uses: opspresso/action-docker@master
        with:
          args: --docker
        env:
          USERNAME: ${{ secrets.QUAY_USERNAME }}
          PASSWORD: ${{ secrets.QUAY_PASSWORD }}
          REGISTRY: "quay.io"
          TAG_NAME: "v0.0.1"
          BUILDX: "true"

      - name: Build & Push to GitHub Package
        uses: opspresso/action-docker@master
        with:
          args: --docker
        env:
          PASSWORD: ${{ secrets.GHP_TOKEN }}
          REGISTRY: "docker.pkg.github.com"
          TAG_NAME: "v0.0.1"

      - name: Build & Push to AWS ECR Private
        uses: opspresso/action-docker@master
        with:
          args: --ecr
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID_BRUCE }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY_BRUCE }}
          AWS_REGION: "ap-northeast-2"
          TAG_NAME: "v0.0.1"
          BUILDX: "true"

      - name: Build & Push to AWS ECR Public
        uses: opspresso/action-docker@master
        with:
          args: --ecr
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: "ap-northeast-2"
          REGISTRY: "public.ecr.aws/nalbam"
          TAG_NAME: "v0.0.1"
          BUILDX: "true"
```

## Github Action 빌드 로그

```
# [docker] start...

$ docker login  -u ***
WARNING! Your password will be stored unencrypted in /github/home/.docker/config.json.
Login Succeeded
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store


$ docker buildx create --use --name ops-1630641363
ops-1630641363

$ docker buildx build  -t ***/sample-node:v0.8.56 -f Dockerfile .
#1 [internal] booting buildkit
#1 pulling image moby/buildkit:buildx-stable-1
#1 pulling image moby/buildkit:buildx-stable-1 4.6s done
#1 creating container buildx_buildkit_ops-16306413630
#1 creating container buildx_buildkit_ops-16306413630 0.4s done
#1 DONE 5.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 203B done
#2 DONE 0.0s

#3 [internal] load .dockerignore
#3 transferring context: 54B done
#3 DONE 0.0s

#5 [linux/arm64 internal] load metadata for docker.io/library/node:13-alpine
#5 ...

#6 [auth] library/node:pull token for registry-1.docker.io
#6 DONE 0.0s

#4 [linux/amd64 internal] load metadata for docker.io/library/node:13-alpine
#4 ...

#7 [auth] library/node:pull token for registry-1.docker.io
#7 DONE 0.0s

#4 [linux/amd64 internal] load metadata for docker.io/library/node:13-alpine

#9 [linux/amd64 2/4] WORKDIR /data
#9 DONE 1.9s

#15 [linux/arm64 3/4] COPY ./entrypoint.sh /data/entrypoint.sh
#15 DONE 0.0s

#11 [linux/amd64 3/4] COPY ./entrypoint.sh /data/entrypoint.sh
#11 DONE 0.0s

#12 [linux/amd64 4/4] ADD . /data
#12 DONE 2.5s

#16 [linux/arm64 4/4] ADD . /data
#16 DONE 2.5s

#17 exporting to image
#17 exporting layers
#17 exporting layers 6.2s done
#17 exporting manifest sha256:6ff451754b9cc68a11b044f99f52969faaf4ac389f940dd610c341665a0d92e8 done
#17 exporting config sha256:67930b934cd15c44f91d0c9e623cc6c5507738f3a6be637d9a4d18405a9c5e2f done
#17 exporting manifest sha256:3e8eaa2b33557e3ecff57eeb936af8e19058788af2a0a9e2cda45faf8e23057f done
#17 exporting config sha256:d7f620c0af01e1242d678c5dde51806d592ec65e3bc15ff1ae1a6b352fc7c5f4 done
#17 exporting manifest list sha256:1c9e2ac294028c76a842a858710e0d46b3851496c0eca91271e3cdf1518aa3c7 done
#17 pushing layers
#17 ...

#18 [auth] ***/sample-node:pull,push token for registry-1.docker.io
#18 DONE 0.0s

#17 exporting to image
#17 ...

#19 [auth] ***/sample-node:pull,push token for registry-1.docker.io
#19 DONE 0.0s

#17 exporting to image
#17 pushing layers 3.3s done
#17 pushing manifest for docker.io/***/sample-node:v0.8.56@sha256:1c9e2ac294028c76a842a858710e0d46b3851496c0eca91271e3cdf1518aa3c7
#17 pushing manifest for docker.io/***/sample-node:v0.8.56@sha256:1c9e2ac294028c76a842a858710e0d46b3851496c0eca91271e3cdf1518aa3c7 1.0s done
#17 DONE 10.6s

$ docker buildx imagetools inspect ***/sample-node:v0.8.56
Name:      docker.io/***/sample-node:v0.8.56
MediaType: application/vnd.docker.distribution.manifest.list.v2+json
Digest:    sha256:1c9e2ac294028c76a842a858710e0d46b3851496c0eca91271e3cdf1518aa3c7

Manifests:
  Name:      docker.io/***/sample-node:v0.8.56@sha256:6ff451754b9cc68a11b044f99f52969faaf4ac389f940dd610c341665a0d92e8
  MediaType: application/vnd.docker.distribution.manifest.v2+json
  Platform:  linux/arm64

  Name:      docker.io/***/sample-node:v0.8.56@sha256:3e8eaa2b33557e3ecff57eeb936af8e19058788af2a0a9e2cda45faf8e23057f
  MediaType: application/vnd.docker.distribution.manifest.v2+json
  Platform:  linux/amd64

$ docker logout
Removing login credentials for https://index.docker.io/v1/
```

## Amazone EKS 배포

Amazon EKS `1.21` 에 인스턴스 타입이 `c6g.large` 인 nodegroup `graviton` 을 만들고 `taints` 를 걸어 주었어요.

![kubectl-get-node](/assets/images/2021-09-03/kubectl-get-node.png)

그리고 해당 노드그룹에 배포 했을때, 아키텍처에 맞는 image 를 pull 도 잘 하고 실행도 잘 되었어요.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: sample-node
    app.kubernetes.io/instance: sample-node-eks-demo
    version: v0.8.56
  name: sample-node
  namespace: default
spec:
  revisionHistoryLimit: 0
  selector:
    matchLabels:
      app.kubernetes.io/instance: sample-node-eks-demo
      app.kubernetes.io/name: sample-node
  template:
    metadata:
      labels:
        app: sample-node
        app.kubernetes.io/instance: sample-node-eks-demo
        app.kubernetes.io/name: sample-node
        version: v0.8.56
    spec:
      containers:
        - name: app
          image: nalbam/sample-node:v0.8.56
          ports:
            - containerPort: 3000
              name: http
              protocol: TCP
      nodeSelector:
        group: graviton
      tolerations:
        - effect: NoSchedule
          key: group
          operator: Equal
          value: graviton
```
