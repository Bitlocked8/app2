import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    // Cargar datos del localStorage al iniciar
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      this.tokenSubject.next(storedToken);
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/login', { email, password }).pipe(
      tap((res: any) => {
        this.setToken(res.token);
        this.setUser(res.user);
      })
    );
  }

  setToken(token: string) {
    this.tokenSubject.next(token);
    localStorage.setItem('authToken', token);
  }

  setUser(user: any) {
    this.userSubject.next(user);
    localStorage.setItem('authUser', JSON.stringify(user));
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getUser(): any {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  logout() {
    this.tokenSubject.next(null);
    this.userSubject.next(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
}
