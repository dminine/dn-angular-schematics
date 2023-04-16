import { MyData } from './types';
import { DbAdapter } from '../../core/db/db.adapter';
import {
  ColdObservableOnce,
  HotObservableOnce,
  InfinityList,
  PaginationList,
} from '../../core/types';
import {
  DbListResponse,
  DbOptions,
  DbQuery,
} from '../../core/db/types';
import {
  makeDbInfinityList,
  makeDbPaginationList,
} from '../../core/db/utils';
import firebase from 'firebase/compat';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;
import DocumentData = firebase.firestore.DocumentData;

export class MyDataService {
  constructor(
    protected myDataDb: DbAdapter<MyData>,
  ) {}

  getDocumentSnapShot(
    id: string
  ): ColdObservableOnce<DocumentSnapshot<DocumentData>> {
    return this.myDataDb.getDocumentSnapShot(id);
  }

  list(
    query?: DbQuery,
    options?: DbOptions
  ): ColdObservableOnce<DbListResponse<MyData>> {
    return this.myDataDb.list(query, options);
  }

  paginationList(query: DbQuery, options?: DbOptions): PaginationList<MyData> {
    return makeDbPaginationList(this.myDataDb, query, options);
  }

  infinityList(query: DbQuery, options?: DbOptions): InfinityList<MyData> {
    return makeDbInfinityList(this.myDataDb, query, options);
  }

  get(id: string): ColdObservableOnce<MyData> {
    return this.myDataDb.get(id);
  }

  add(MyData: Partial<MyData>): HotObservableOnce<MyData> {
    return this.myDataDb.add(MyData);
  }

  update(id: string, MyData: Partial<MyData>): HotObservableOnce<void> {
    return this.myDataDb.update(id, MyData);
  }

  delete(id: string): HotObservableOnce<void> {
    return this.myDataDb.delete(id);
  }
}
