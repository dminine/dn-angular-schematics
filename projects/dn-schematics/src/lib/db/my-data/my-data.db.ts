import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import { FirestoreDbAdapter } from '../../../../../../src/modules/firebase/firestore-db.adapter';
import { MyData } from '../../../../../../src/entities/myData/types';

@Injectable({
  providedIn: 'root',
})
export class NgMyDataDb extends FirestoreDbAdapter<MyData> {
  constructor() {
    super(firebase.firestore(), 'myDatas');
  }
}
