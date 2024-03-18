import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  mainTitle$ = new BehaviorSubject('Home');
  isDeleteDialogShow$ = new BehaviorSubject({ show: false, component: '' });
  deleteDialogResult$ = new BehaviorSubject({ confirm: false, component: '' });

  setIsAuthentic(title: string) {
    this.mainTitle$.next(title);
  }

  setIsDeleteDialogShow(show: boolean, component: string) {
    this.isDeleteDialogShow$.next({ show: show, component: component });
  }

  setDeleteDialogResult(confirm: boolean, component: string) {
    this.deleteDialogResult$.next({ confirm: confirm, component: component });
  }
}
