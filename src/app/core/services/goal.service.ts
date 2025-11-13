import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Goal, GoalRequest } from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private apiUrl = `${environment.apiUrl}/goals`;

  constructor(private http: HttpClient) {}

  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.apiUrl);
  }

  getGoal(id: number): Observable<Goal> {
    return this.http.get<Goal>(`${this.apiUrl}/${id}`);
  }

  createGoal(request: GoalRequest): Observable<Goal> {
    return this.http.post<Goal>(this.apiUrl, request);
  }

  updateGoal(id: number, request: GoalRequest): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/${id}`, request);
  }

  updateProgress(id: number, amount: number): Observable<Goal> {
    return this.http.patch<Goal>(`${this.apiUrl}/${id}/progress`, { amount });
  }

  cancelGoal(id: number): Observable<Goal> {
    return this.http.patch<Goal>(`${this.apiUrl}/${id}/cancel`, {});
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}