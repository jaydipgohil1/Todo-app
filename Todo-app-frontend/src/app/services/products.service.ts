import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from '../environments/environment';
import { Category, Product } from '../interface/products.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  apiUrl = environment.apiBaseUrl;
  constructor(private http: HttpService) { }

  getCategoryList(): Observable<any> {
    return this.http.get(`category`);
  }

  addCategory(payload: { category_name: String }): Observable<any> {
    return this.http.post(`category`, payload);
  }

  updateCategory(id: string, payload: Category): Observable<any> {
    return this.http.patch(`category/${id}`, payload);
  }

  deleteCategory(id: String): Observable<any> {
    return this.http.delete(`category/${id}`);
  }

  getProductsList(): Observable<any> {
    return this.http.get(`product`);
  }

  addProduct(payload: Product): Observable<any> {
    return this.http.post(`product`, payload);
  }

  updateProduct(id: string, payload: Product): Observable<any> {
    return this.http.patch(`product/${id}`, payload);
  }

  deleteProduct(id: String): Observable<any> {
    return this.http.delete(`product/${id}`);
  }

}
