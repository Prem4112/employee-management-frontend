import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/login`, data);
  }


  getEmployees(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employees`);
  }

 
  addEmployee(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/employees`, data);
  }

 
  updateEmployee(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/employees/${id}`, data);
  }

 
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employees/${id}`);
  }

}
