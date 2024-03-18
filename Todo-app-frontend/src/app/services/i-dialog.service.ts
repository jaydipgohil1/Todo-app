import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IDialogService {

  isDialogShow$ = new BehaviorSubject({ show: false, title: '', component: null, isUpdate: false, data: null });
  dialogResult$ = new BehaviorSubject(null);

  setDialogShow(show: boolean, title: string, component: any, isUpdate: boolean, data: any) {
    this.isDialogShow$.next({ show: show, title: title, component: component, isUpdate: isUpdate, data: data });
  }

  setDialogResult(result: any) {
    this.dialogResult$.next(result);
  }

}
