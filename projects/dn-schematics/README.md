#Dmin Angular Schematics

자주 사용하는 angular schematics generate 를 정의하는 서비스

## 프로젝트 구성 요소

1. 빈 angular 프로젝트
2. projects 하위의 dn-schematics library 프로젝트

## 프로젝트 구성 방법

```
ng new dn-angular-shcematics --create-application false

ng generate library dn-schematics
```

라이브러리 최상위 폴더 아래에 schematics 폴더를 생성합니다.

schematics 폴더에 첫번째 스키매틱으로 사용할 ng-add 폴더를 생성합니다.

schematics 폴더에 collection.json 파일을 생성합니다.

collection.json 파일의 내용을 다음과 같이 작성합니다.

```json
{
  "$schema": "../../../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "ng-add": {
      "description": "Add my library to the project.",
      "factory": "./ng-add/index#ngAdd"
    }
  }
}
```

라이브러리 프로젝트의 package.json 파일에 "schematics"를 추가하고 위에서 작성한 스키마 파일의 경로를 지정합니다. 그러면 Angular CLI가 이 스키마 파일의 내용을 추가하며 확장됩니다.

```json
{
  "name": "my-lib",
  "version": "0.0.1",
  "schematics": "./schematics/collection.json"
}
```

## Schematics Build

먼저 아래 Script 를 실행한다

```
build:my-lib
```

이후에 아래 Script 를 실행한다

```
build:mac
```

## Entity Schematic 실행

```
ng generate dn-schematics:entity-service my-data
```

## Admin Schematic 실행

```
ng generate dn-schematics:admin-list list-page
ng generate dn-schematics:admin-detail detail-page
ng generate dn-schematics:admin-add add-page
ng generate dn-schematics:admin-modify modify-page
```
