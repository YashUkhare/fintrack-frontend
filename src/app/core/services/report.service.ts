import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  downloadPdfReport(startDate: string, endDate: string): void {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    this.http.get(`${this.apiUrl}/pdf`, { 
      params, 
      responseType: 'blob' 
    }).subscribe(blob => {
      saveAs(blob, `financial-report-${startDate}-${endDate}.pdf`);
    });
  }

  downloadExcelReport(startDate: string, endDate: string): void {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    
    this.http.get(`${this.apiUrl}/excel`, { 
      params, 
      responseType: 'blob' 
    }).subscribe(blob => {
      saveAs(blob, `financial-report-${startDate}-${endDate}.xlsx`);
    });
  }
}