import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 
                flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        <!-- Logo & Title -->
        <div class="text-center mb-8 animate-fade-in">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full 
                      bg-primary-500 text-white mb-4 shadow-lg">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password?</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">
            No worries, we'll send you reset instructions
          </p>
        </div>

        <!-- Reset Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-slide-in">
          <form *ngIf="!emailSent" [formGroup]="resetForm" (ngSubmit)="onSubmit()">
            <!-- Email Field -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                formControlName="email"
                placeholder="you@example.com"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                [class.border-red-500]="resetForm.get('email')?.invalid && resetForm.get('email')?.touched"
              />
              <p *ngIf="resetForm.get('email')?.invalid && resetForm.get('email')?.touched" 
                 class="mt-1 text-sm text-red-500">
                Please enter a valid email address
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="resetForm.invalid || loading"
              class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 
                     text-white font-medium py-3 px-4 rounded-lg
                     transition-all duration-200 transform hover:scale-[1.02]
                     disabled:cursor-not-allowed disabled:hover:scale-100
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              <span *ngIf="!loading">Reset Password</span>
              <span *ngIf="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" 
                     fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            </button>
          </form>

          <!-- Success Message -->
          <div *ngIf="emailSent" class="text-center py-4">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full 
                        bg-green-100 dark:bg-green-900/30 mb-4">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Check your email</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              We've sent password reset instructions to<br/>
              <span class="font-medium text-gray-900 dark:text-white">{{resetForm.get('email')?.value}}</span>
            </p>
            <button
              (click)="emailSent = false"
              class="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium">
              Didn't receive the email? Click to resend
            </button>
          </div>

          <!-- Back to Login -->
          <div class="mt-8 text-center">
            <a routerLink="/auth/login" 
               class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 
                      hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class ForgotPasswordComponent {
    resetForm: FormGroup;
    loading = false;
    emailSent = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private toastr: ToastrService
    ) {
        this.resetForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit(): void {
        if (this.resetForm.valid && !this.loading) {
            this.loading = true;
            const email = this.resetForm.get('email')?.value;

            this.authService.requestPasswordReset(email).subscribe({
                next: () => {
                    this.loading = false;
                    this.emailSent = true;
                    this.toastr.success('Password reset email sent', 'Success');
                },
                error: (error) => {
                    this.loading = false;
                    this.toastr.error(error.error?.message || 'Failed to send reset email', 'Error');
                }
            });
        }
    }
}