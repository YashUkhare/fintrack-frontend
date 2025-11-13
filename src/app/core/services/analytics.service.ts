import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardAnalytics } from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getDashboardAnalytics(startDate: string, endDate: string): Observable<DashboardAnalytics> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    return this.http.get<DashboardAnalytics>(`${this.apiUrl}/dashboard`, { params });
  }

  getSpendingPredictions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/predictions`);
  }
}