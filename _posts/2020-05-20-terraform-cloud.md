---
title: "Terraform Cloud"
date: 2020-05-20 13:12:45 +0900
---

얼마전까지 [Terraform Cloud](https://app.terraform.io/) 에서 관리 할 수 있는 워크스페이스가 2개 인줄 알고 있었으나, 무료 사용의 경우도 무제한 이라고 합니다.

![Unlimited Workspaces](/assets/images/2020-05-20/free.png)

그래서 테스트용으로 관리/유지 하고 있던 코드를 Terraform Cloud 로 옮기는 작업을 했습니다.

![DEMO Workspaces](/assets/images/2020-05-20/workspaces.png)

그래서 Cloud 로 이전 했던 내용들을 공유 하려고 합니다.

# 연결 끊기

우선 기존의 리소스는 `AWS S3` 에 저장되고 있습니다.
또한 `vpc_id`, `subnet_id` 값을 얻기 위해 `remote_state` 를 사용하고 있습니다.

```hcl
terraform {
  backend "s3" {
    region         = "ap-northeast-2"
    bucket         = "terraform-demo-seoul"
    key            = "bastion.tfstate"
    dynamodb_table = "terraform-demo-seoul"
    encrypt        = true
  }
  required_version = ">= 0.12"
}

data "terraform_remote_state" "vpc" {
  backend = "s3"
  config = {
    region = "ap-northeast-2"
    bucket = "terraform-demo-seoul"
    key    = "vpc-demo.tfstate"
  }
}
```

S3 와의 연결을 끊기위해 위의 설정을 모두 주석 처리 합니다.
S3 에서 `bastion.tfstate` 을 다운받아 소스 디렉토리에 `terraform.tfstate` 으로 저장 합니다.

```hcl
  # vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id
  vpc_id = "vpc-0c595d8f4301b48c5"

  # subnet_id = data.terraform_remote_state.vpc.outputs.public_subnet_ids[0]
  subnet_id = "subnet-0996a66652b801ce0"
```

그리고 `remote_state` 에서 얻어오던 `vpc_id`, `subnet_id` 를 실제 값으로 입력 합니다.

이제 모든 원격 연결이 끊어졌습니다.

![bastion offline](/assets/images/2020-05-20/bastion-offline.png)

`terraform plan && terraform apply` 를 해도 변경 사항이 없다는 메세지가 출력 됩니다.

# 이전 시작

[Terraform Cloud](https://app.terraform.io/) 에 접속하여 Organization 을 생성 합니다.

![New Organization](/assets/images/2020-05-20/new-organization.png)

저는 `mzcdev` 라고 하겠습니다.

![New Workspace](/assets/images/2020-05-20/new-workspace-01.png)

새로운 워크스페이스를 만들기위해 Github repository 와 연결 합니다.

![Configure settings](/assets/images/2020-05-20/new-workspace-02.png)

선택한 GitHub organization/repository 에 따라 자동으로 이름이 입력 되지만, 저는 `dev-bastion` 으로 변경 했습니다.
코드 위치에 따라 `Advanced options` 에서 하위 디렉토리를 입력 할 수 있습니다.

![Environment Variables](/assets/images/2020-05-20/new-workspace-03.png)

마지막으로 `AWS Credentials` 을 입력합니다. 민감한 정보는 `Sensitive` 를 체크해 주도록 합니다.

```hcl
terraform {
  backend "remote" {
    organization = "mzcdev"
    workspaces {
      name = "dev-bastion"
    }
  }
}
```

이제 Terraform Cloud 로 이전 하기위해 코드에 위와 같이 `backend remote` 를 입력 합니다.
이때 `organization` 과 `workspaces name` 을 일치 시켜 줍니다.

```bash
$ terraform init

Initializing modules...

Initializing the backend...
Acquiring state lock. This may take a few moments...
Do you want to copy existing state to the new backend?
  Pre-existing state was found while migrating the previous "local" backend to the
  newly configured "remote" backend. No existing state was found in the newly
  configured "remote" backend. Do you want to copy this state to the new "remote"
  backend? Enter "yes" to copy and "no" to start with an empty state.

  Enter a value:
```

`terraform init` 을 하면, local 의 states 를 remote 로 업로드 할 지 물어 봅니다.

![States](/assets/images/2020-05-20/new-workspace-04.png)

`yes` 를 입력하면 업로드 되고, 웹콘솔에서 확인 할 수 있습니다.

이제 코드를 `commit && push` 합니다.

![Queue plan](/assets/images/2020-05-20/queue-plan.png)

`Queue plan` 을 실행해 봅니다.

![PLANNED](/assets/images/2020-05-20/planned.png)

`PLANNED` 상태가 되면 정상 입니다.

```hcl
data "terraform_remote_state" "vpc" {
  backend = "remote"
  config = {
    organization = "mzcdev"
    workspaces = {
      name = "dev-vpc-demo"
    }
  }
}
```

```hcl
  vpc_id = data.terraform_remote_state.vpc.outputs.vpc_id

  subnet_id = data.terraform_remote_state.vpc.outputs.public_subnet_ids[0]
```

마지막으로 `vpc_id`, `subnet_id` 정보를 `remote_state` 에서 얻어오도록 변경 합니다.

코드를 `commit && push` 합니다.

![PLANNING](/assets/images/2020-05-20/planning.png)

자동으로 Trigging 되어 plan 을 수행 합니다.

![PLANNED](/assets/images/2020-05-20/done.png)

`PLANNED` 상태가 되면 완료 입니다.

감사합니다.
