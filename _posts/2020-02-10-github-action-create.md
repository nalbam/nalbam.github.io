---
title: "GitHub Action 생성하기"
date: 2020-02-10 16:29:54 +0900
---
GitHub Action 을 직접 작성하는 방법을 소개 합니다.

```
이 Action 은 local 파일을 AWS S3 에 sync 하기위한 Action 입니다.
```

빈 레파지토리를 만들고, 다음과 같은 파일을 생성 합니다.

```
.
├── Dockerfile    # GitHub Action 에서 실행 될 이미지 생성 파일
├── README.md     # 프로젝트 설명 파일
├── action.yml    # Marketplace 에 배포 하기 위해 필요
└── entrypoint.sh # Dockerfile 에서 실행될 스크립트
```

## action.yml

Marketplace 에 배포 하기 위한 정보를 입력 합니다.

* <https://help.github.com/en/actions/automating-your-workflow-with-github-actions/metadata-syntax-for-github-actions#example-using-public-docker-container-on-github>

`runs.image` 에 Dockerfile 를 넣으면 Action 수행 마다 docker build 를 합니다.
이미 docker image 를 만들었다면 이미지 경로를 넣어 줍니다.

```yaml
name: "AWS S3 Sync"
description: "Sync a directory to an AWS S3 repository"
author: "Jungyoul Yu <@nalbam>"

branding:
  icon: "refresh-cw"
  color: "green"

runs:
  using: "docker"
  image: "Dockerfile"
  # image: "docker://opspresso/action-s3-sync:v0.2.3"
```

## Dockerfile

Action 에서 사용할 Dockerfile 을 작성 합니다.

* <https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-a-docker-container-action>

```dockerfile
FROM opspresso/builder:alpine

ADD entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
```

## entrypoint.sh

Docker image 실행시 동작할 쉘을 이력해 줍니다.

```bash
#!/bin/bash

# aws credentials
aws configure <<-EOF > /dev/null 2>&1
${AWS_ACCESS_KEY_ID}
${AWS_SECRET_ACCESS_KEY}
${AWS_REGION}
text
EOF

# aws s3 sync
aws s3 sync ${FROM_PATH} ${DEST_PATH} ${OPTIONS}
```

## 실행

Action 코드를 실행 하기전 GitHub > Setings > Secrets 에 사용자 정의 secret 을 입력 합니다.
이번 Action 은 `AWS_ACCESS_KEY_ID` 과 `AWS_SECRET_ACCESS_KEY` 이 필요 합니다.

![guthub-secrets](/assets/images/2020-02-10/github-secrets.png)

```yaml
...

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Publish to AWS S3
        uses: opspresso/action-s3-sync@master
        env:
          AWS_ACCESS_KEY_ID: ${ { secrets.AWS_ACCESS_KEY_ID } }
          AWS_SECRET_ACCESS_KEY: ${ { secrets.AWS_SECRET_ACCESS_KEY } }
          AWS_REGION: "us-east-1"
          FROM_PATH: "./target/publish"
          DEST_PATH: "s3://your_bucket_name/path/"
          OPTIONS: "--acl public-read"
```

## 지금까지 만든 Actions

* <https://github.com/marketplace/actions/aws-s3-sync>
* <https://github.com/marketplace/actions/docker-push>
* <https://github.com/marketplace/actions/post-slack>
* <https://github.com/marketplace/actions/release-to-github>

## 참고 문서

* <https://help.github.com/en/actions/automating-your-workflow-with-github-actions>
