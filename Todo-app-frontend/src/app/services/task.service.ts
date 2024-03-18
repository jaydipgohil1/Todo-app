import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpService) { }

  getTaskList(): Observable<any> {
    return this.http.get(`task`);
  }

  addTask(payload: { category_name: String }): Observable<any> {
    return this.http.post(`task`, payload);
  }

  updateTask(id: string, payload: any): Observable<any> {
    return this.http.patch(`task/${id}`, payload);
  }

  deleteTask(id: String): Observable<any> {
    return this.http.delete(`task/${id}`);
  }

}
