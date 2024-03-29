---
layout: post
title: "GitHub Action 으로 빌드하기"
feature-img: /assets/images/2020-02-10/github-action-build.png
# thumbnail: /assets/images/2020-02-10/github-action-build.png
header:
  og_image: /assets/images/2020-02-10/github-action-build.png
tags: [github, github-action]
---

GitHub Actions 이 GA 되어 모든 사람이 사용할 수 있게 되고 어느 정도 흘렀습니다.
그즈음 몇가지 Action 을 만들어 GitHub Marketplace 에 올렸으나, 이제야 한번 정리해 봅니다.

GitHub Action 은 GitHub 이 만든 CI/CD 서비스 입니다.
가장 가까운 경쟁자로는 CircleCi, TravisCi 등의 SaaS CI/CD 서비스가 있겠네요.

위의 두 서비스는 외부에 존재하는 깃의 권한을 부여 하고, Hook 을 통해 이벤트를 받고, 소스를 끌어다가 빌드를 시작 합니다.

GitHub Action 은 GitHub 을 위한 서비스로, 각 소스 root 의 .github/workflows/ 디렉토리에 빌드 설정이 있으면 해당 조건에 따라 무조건 실행 됩니다.

GitHub Action yaml 은 다음과 같이 구성 됩니다.

```yaml
# .github/workflows/push.yml

name: Build-Push # Workflow 이름

on: # Event 조건
  push: # Push 가 발생 하면
    branches:
      - master # master branch 에서

jobs: # Job 설정
  build:
    runs-on: ubuntu-latest # 실행 되는 가상 환경

    steps: # steps
      - name: Checkout # 첫번째 step
        uses: actions/checkout@v3 # 소소를 가져 온다

      - name: Setup Node # 두번째 step
        uses: actions/setup-node@v1 # node 컨테이너를 setup 한다
        with:
          node-version: "12.x" # node 버전 12.x 지정

      - name: Run Build # 세번째 step
        run: | # npm install 을 실행
          npm install

      - name: Release to GitHub # 네번째 step
        uses: opspresso/action-builder@master # 사용자 정의 action
        with:
          args: --release # 사용자 정의 argument 를 전달
        env:
          SLACK_TOKEN: ${ { secrets.SLACK_TOKEN } } # 사용자 정의 secret 을 전달
```

Action 코드를 Push 하기전 (필요하다면) GitHub > Setings > Secrets 에 사용자 정의 secret 을 입력 합니다.

![guthub-secrets](/assets/images/2020-02-10/github-secrets.png)

이제 Action 코드를 Push 하면 바로 빌드가 시작 됩니다.

![guthub-action-build](/assets/images/2020-02-10/github-action-build.png)

이 Action 에서는 사용자 정의 Action step 을 사용 했습니다.
다음 포스트에서 사용자 정의 Action 을 만드는 방법을 소개 하겠습니다.
