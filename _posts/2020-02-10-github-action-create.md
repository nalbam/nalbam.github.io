---
title: "GitHub Action 생성하기"
date: 2020-02-10 16:29:54 +0900
---
GitHub Action 을 직접 작성하는 방법을 소개 합니다.

빈 레파지토리를 만들고, 다음과 같은 파일을 생성 합니다.

```
.
├── Dockerfile    # GitHub Action 에서 실행 될 이미지 생성 파일
├── README.md     # 프로젝트 설명 파일
├── action.yml    # Marketplace 에 배포 하기 위해 필요
└── entrypoint.sh # Dockerfile 에서 실행될 스크립트
```

참고 문서
* <https://help.github.com/en/actions/automating-your-workflow-with-github-actions>
