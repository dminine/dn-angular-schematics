# 드민스 네트워크 Angular Schematics 

### ng generate dn-schematics:entity-service --name ${name}

생성되는 파일 및 위치

1. src/entities/${name}/${name}.service.ts
2. src/entities/${name}/types.ts
3. projects/${library-project-name}/src/lib/db/${name}/${name}.service.ts
4. projects/${library-project-name}/src/lib/db/${name}/${name}.db.ts

예제: kevin projects 의 board entity 추가

```
ng generate dn-schematics:entity-service board

CREATE src/entities/board/board.service.ts (1600 bytes)
CREATE src/entities/board/types.ts (100 bytes)
CREATE projects/kevin/src/lib/db/board/board.service.ts (338 bytes)
CREATE projects/kevin/src/lib/db/board/board.db.ts (420 bytes)
```


### 추가로 확인 해야 하는 부분

${name}.db.ts의 collectionName property 는 ${name} + s 로 구성되어 있다.

일반 s가 아니고 es 혹은 ies 같은 경우 따로 수정을 진행 해줘야 한다.

```ts
export class NgBoardDb extends FirestoreDbAdapter<Board> {
  constructor() {
    super(firebase.firestore(), 'boards'); <-- 해당 부분
  }
}
```

### Admin Schematic 실행

```
ng generate dn-schematics:admin-list list-page
ng generate dn-schematics:admin-detail detail-page
ng generate dn-schematics:admin-add add-page
ng generate dn-schematics:admin-modify modify-page
```