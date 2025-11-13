import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">FinTrack</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Sign in to your account</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-slide-in">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
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
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       transition-all duration-200"
                [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              />
              <p *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                 class="mt-1 text-sm text-red-500">
                Please enter a valid email address
              </p>
            </div>

            <!-- Password Field -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div class="relative">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="••••••••"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         transition-all duration-200 pr-12"
                  [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                />
                <button
                  type="button"
                  (click)="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg *ngIf="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                 class="mt-1 text-sm text-red-500">
                Password is required
              </p>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between mb-6">
              <label class="flex items-center">
                <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-primary-600 
                                               focus:ring-primary-500">
                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <a routerLink="/auth/forgot-password" 
                 class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Forgot password?
              </a>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loginForm.invalid || loading"
              class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 
                     text-white font-medium py-3 px-4 rounded-lg
                     transition-all duration-200 transform hover:scale-[1.02]
                     disabled:cursor-not-allowed disabled:hover:scale-100
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              <span *ngIf="!loading">Sign In</span>
              <span *ngIf="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" 
                     fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?
              <a routerLink="/auth/register" 
                 class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 ml-1">
                Sign up for free
              </a>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          © 2025 FinTrack. All rights reserved.
        </p>
      </div>
    </div>
  `,
    styles: []
})
export class LoginComponent {
    loginForm: FormGroup;
    loading = false;
    showPassword = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid && !this.loading) {
            this.loading = true;
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.toastr.success('Welcome back!', 'Login Successful');
                    this.router.navigate(['/dashboard']);
                },
                error: (error) => {
                    this.loading = false;
                    this.toastr.error(error.error?.message || 'Invalid credentials', 'Login Failed');
                }
            });
        }
    }
}