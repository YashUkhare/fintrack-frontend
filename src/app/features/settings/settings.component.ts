// src/app/features/settings/settings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { ReportService } from '../../core/services/report.service';
import { ToastrService } from 'ngx-toastr';
import { format, startOfMonth, endOfMonth } from 'date-fns';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="p-6 space-y-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      <!-- Profile Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile Information
        </h2>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input type="text" [value]="currentUser?.firstName || 'John'"
                     class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-primary-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input type="text" [value]="currentUser?.lastName || 'Doe'"
                     class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-primary-500">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input type="email" [value]="currentUser?.email" readonly
                   class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                          bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed">
          </div>
          <button class="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg">
            Update Profile
          </button>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Change Password
        </h2>
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input type="password" formControlName="currentPassword"
                     class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-primary-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input type="password" formControlName="newPassword"
                     class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-primary-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input type="password" formControlName="confirmPassword"
                     class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-primary-500">
            </div>
            <button type="submit" [disabled]="passwordForm.invalid || changingPassword"
                    class="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg
                           disabled:bg-gray-300 disabled:cursor-not-allowed">
              {{changingPassword ? 'Changing...' : 'Change Password'}}
            </button>
          </div>
        </form>
      </div>

      <!-- Appearance -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Appearance
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</p>
            </div>
            <button (click)="toggleTheme()"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                    [class.bg-primary-500]="isDarkMode"
                    [class.bg-gray-200]="!isDarkMode">
              <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    [class.translate-x-6]="isDarkMode"
                    [class.translate-x-1]="!isDarkMode"></span>
            </button>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Currency
            </label>
            <select class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-primary-500">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Export & Reports -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Export & Reports
        </h2>
        <div class="space-y-4">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Download your financial data and generate reports
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button (click)="downloadPdf()"
                    class="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 
                           dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                           transition-colors">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="font-medium text-gray-900 dark:text-white">Download PDF</span>
            </button>
            <button (click)="downloadExcel()"
                    class="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 
                           dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                           transition-colors">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="font-medium text-gray-900 dark:text-white">Download Excel</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Notifications
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Receive email alerts</p>
            </div>
            <input type="checkbox" checked
                   class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500">
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Budget Alerts</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Alert when budget exceeds threshold</p>
            </div>
            <input type="checkbox" checked
                   class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500">
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Goal Milestones</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Notify on goal progress</p>
            </div>
            <input type="checkbox" checked
                   class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500">
          </div>
          <div class="flex items-center justify-between py-3">
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Monthly Reports</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Monthly financial summary</p>
            </div>
            <input type="checkbox" checked
                   class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500">
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <h2 class="text-xl font-semibold text-red-900 dark:text-red-400 mb-4 flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Danger Zone
        </h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-red-900 dark:text-red-400">Delete Account</h3>
              <p class="text-sm text-red-700 dark:text-red-500">
                Permanently delete your account and all data
              </p>
            </div>
            <button class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg
                           transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class SettingsComponent implements OnInit {
    currentUser: any = null;
    isDarkMode = false;
    changingPassword = false;

    passwordForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private themeService: ThemeService,
        private reportService: ReportService,
        private toastr: ToastrService
    ) {
        this.passwordForm = this.fb.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });

        this.themeService.darkMode$.subscribe(isDark => {
            this.isDarkMode = isDark;
        });
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('newPassword');
        const confirmPassword = form.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            return { passwordMismatch: true };
        }
        return null;
    }

    toggleTheme(): void {
        this.themeService.toggleDarkMode();
    }

    changePassword(): void {
        if (this.passwordForm.valid && !this.changingPassword) {
            this.changingPassword = true;
            const { currentPassword, newPassword } = this.passwordForm.value;

            this.authService.changePassword(currentPassword, newPassword).subscribe({
                next: () => {
                    this.changingPassword = false;
                    this.passwordForm.reset();
                    this.toastr.success('Password changed successfully');
                },
                error: () => {
                    this.changingPassword = false;
                    this.toastr.error('Failed to change password');
                }
            });
        }
    }

    downloadPdf(): void {
        const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');
        this.reportService.downloadPdfReport(startDate, endDate);
        this.toastr.success('Generating PDF report...');
    }

    downloadExcel(): void {
        const startDate = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');
        this.reportService.downloadExcelReport(startDate, endDate);
        this.toastr.success('Generating Excel report...');
    }
}