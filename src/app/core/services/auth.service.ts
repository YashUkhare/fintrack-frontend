import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private tokenKey = 'fintrack_token';
    private userKey = 'fintrack_user';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadStoredUser();
    }

    private loadStoredUser(): void {
        const token = localStorage.getItem(this.tokenKey);
        const userStr = localStorage.getItem(this.userKey);

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                this.currentUserSubject.next(user);
            } catch (e) {
                this.logout();
            }
        }
    }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
            .pipe(tap(response => this.handleAuthResponse(response)));
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
            .pipe(tap(response => this.handleAuthResponse(response)));
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    requestPasswordReset(email: string): Observable<string> {
        return this.http.post<string>(`${environment.apiUrl}/auth/password-reset/request`, { email });
    }

    resetPassword(token: string, newPassword: string): Observable<string> {
        return this.http.post<string>(`${environment.apiUrl}/auth/password-reset/confirm`,
            { token, newPassword });
    }

    changePassword(currentPassword: string, newPassword: string): Observable<string> {
        return this.http.post<string>(`${environment.apiUrl}/auth/change-password`,
            { currentPassword, newPassword });
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    private handleAuthResponse(response: AuthResponse): void {
        localStorage.setItem(this.tokenKey, response.token);

        const user: User = {
            id: response.userId,
            email: response.email,
            firstName: '',
            lastName: '',
            fullName: response.fullName,
            role: response.role,
            currency: 'USD'
        };

        localStorage.setItem(this.userKey, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }
}
