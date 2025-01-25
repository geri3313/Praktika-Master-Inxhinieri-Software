import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private adminUrl = 'http://localhost:8080/api/auth'
  constructor(private http:HttpClient) { }

  getAllUsers():Observable<User[]>{
    return this.http.get<User[]>(`${this.adminUrl}/users`);
  }

  deleteUser(id:number):Observable<any>{
    return this.http.delete(`${this.adminUrl}/deleteUser/${id}`);
  }
}
