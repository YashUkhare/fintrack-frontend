// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { DashboardAnalytics } from '../../core/models/analytics.model';
import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  analytics: DashboardAnalytics | null = null;
  loading = true;

  trendChartOptions: any = {};
  categoryChartOptions: any = {};

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');

    this.analyticsService.getDashboardAnalytics(startDate, endDate).subscribe({
      next: (data) => {
        this.analytics = data;
        this.initializeCharts();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  initializeCharts(): void {
    if (!this.analytics) return;

    // Income vs Expense Trend Chart
    this.trendChartOptions = {
      series: [
        {
          name: 'Income',
          data: this.analytics.monthlyTrend.map(t => t.income)
        },
        {
          name: 'Expense',
          data: this.analytics.monthlyTrend.map(t => t.expense)
        }
      ],
      chart: {
        type: 'line',
        height: 300,
        toolbar: { show: false }
      },
      colors: ['#22c55e', '#ef4444'],
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      xaxis: {
        categories: this.analytics.monthlyTrend.map(t => `${t.month.substring(0, 3)} ${t.year}`)
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'top'
      },
      grid: {
        strokeDashArray: 4
      }
    };

    // Category Spending Chart
    const categories = this.analytics.topExpenseCategories;
    this.categoryChartOptions = {
      series: categories.map(c => c.amount),
      chart: {
        type: 'donut',
        height: 300
      },
      labels: categories.map(c => c.categoryName),
      colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
      legend: {
        position: 'bottom'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height: 250
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }

  downloadPdf(): void {
    const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');
    // Report service call would go here
  }
}