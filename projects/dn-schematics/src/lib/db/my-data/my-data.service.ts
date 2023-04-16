import { Injectable } from '@angular/core';
import { MyDataService } from '../../../../../../src/entities/myData/myData.service';
import { NgMyDataDb } from './myData.db';

@Injectable({
  providedIn: 'root',
})
export class NgMyDataService extends MyDataService {
  constructor(protected override myDataDb: NgMyDataDb) {
    super(myDataDb);
  }
}