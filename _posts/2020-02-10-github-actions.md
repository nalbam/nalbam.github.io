---
title: "GitHub Action 작성하기"
date: 2020-02-10 15:17:23 +0900
---
GitHub Actions 가 GA 되어 모든 사람이 사용 할수 있게 되고 어느 정도 흘렀습니다.
그즈음 몇가지 Action 을 만들어 GitHub Marketplace 에 올렸으나, 이제야 한번 정리해 봅니다.

GitHub Action 은 GitHub 이 만든 CI/CD 서비스 입니다.
가장 가까운 경쟁자로는 CircleCi, TravisCi 등이 있겠네요.

이것들 과의 가장 큰 차이는 위의 두 서비스는 외부의 깃의 권한을 부여 하고, Hook 을 통해 이벤트를 받고, 소스를 끌어다가 빌드를 시작 합니다.
GitHub Action 은 GitHub 을 위한 서비스로, 각 소스 root 의 .github/workflows/ 디렉토리에 빌드 설정이 있으면 해당 조건에 따라 무조건 실행 됩니다.

GitHub Action 은 다음과 같은 형식으로 구성 됩니다.

```yaml
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
        uses: actions/checkout@v2 # 소소를 가져 온다

      - name: Setup Node # 두번째 step
        uses: actions/setup-node@v1 # node 컨테이너를 setup 한다
        with:
          node-version: "12.x" # node 버전 12.x 지정

      - name: Run Build # 세번째 step
        run: | # npm install 을 실행
          npm install

      - name: Release to GitHub # 네번째 step
        uses: opspresso/action-builder@master # 사용자 정의 action 을 가져온다
        with:
          args: --release # 사용자 정의 argument 를 전달
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # 사용자 정의 secret 을 전달
```

그리고 이 코드를 push 하면 바로 빌드가 시작 됩니다.

![guthub-action-build](/images/2020-01-10/guthub-action-build.png)
