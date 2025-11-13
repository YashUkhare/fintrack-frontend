import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <!-- Sidebar -->
      <aside [class.translate-x-0]="sidebarOpen"
             class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 
                    border-r border-gray-200 dark:border-gray-700
                    transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
        <!-- Logo -->
        <div class="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">FinTrack</span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="p-4 space-y-1">
          <a *ngFor="let item of navItems"
             [routerLink]="item.path"
             routerLinkActive="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
             class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200
                    group cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.icon" />
            </svg>
            <span class="font-medium">{{item.label}}</span>
            <span *ngIf="item.badge" 
                  class="ml-auto bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
              {{item.badge}}
            </span>
          </a>
        </nav>

        <!-- User Section -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div class="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
              {{getUserInitials()}}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{currentUser?.fullName}}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{currentUser?.email}}
              </p>
            </div>
            <button (click)="logout()" 
                    class="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="lg:pl-64">
        <!-- Header -->
        <header class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700
                       flex items-center justify-between px-6 sticky top-0 z-40">
          <!-- Mobile Menu Button -->
          <button (click)="toggleSidebar()" 
                  class="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 
                         hover:bg-gray-100 dark:hover:bg-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Search Bar -->
          <div class="hidden md:flex flex-1 max-w-lg mx-4">
            <div class="relative w-full">
              <input type="text" 
                     placeholder="Search transactions, budgets, goals..."
                     class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600
                            bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                            focus:ring-2 focus:ring-primary-500 focus:border-transparent">
              <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="flex items-center gap-3">
            <!-- Theme Toggle -->
            <button (click)="toggleTheme()" 
                    class="p-2 rounded-lg text-gray-600 dark:text-gray-400 
                           hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg *ngIf="!isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg *ngIf="isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>

            <!-- Notifications -->
            <button (click)="toggleNotifications()" 
                    class="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 
                           hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span *ngIf="unreadCount > 0" 
                    class="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs 
                           flex items-center justify-center rounded-full">
                {{unreadCount}}
              </span>
            </button>
          </div>
        </header>

        <!-- Page Content -->
        <main class="min-h-[calc(100vh-4rem)]">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Mobile Sidebar Overlay -->
      <div *ngIf="sidebarOpen" 
           (click)="toggleSidebar()"
           class="fixed inset-0 bg-black/50 z-40 lg:hidden"></div>
    </div>
  `,
    styles: []
})
export class MainLayoutComponent implements OnInit {
    sidebarOpen = false;
    isDarkMode = false;
    currentUser: any = null;
    unreadCount = 0;

    navItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            badge: ''
        },
        {
            label: 'Transactions',
            path: '/transactions',
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
        },
        {
            label: 'Budgets',
            path: '/budgets',
            icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
            badge: ''
        },
        {
            label: 'Goals',
            path: '/goals',
            icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
            badge: ''
        },
        {
            label: 'Categories',
            path: '/categories',
            icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
            badge: ''
        },
        {
            label: 'Settings',
            path: '/settings',
            icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
            badge: ''
        }
    ];

    constructor(
        private authService: AuthService,
        private themeService: ThemeService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });

        this.themeService.darkMode$.subscribe(isDark => {
            this.isDarkMode = isDark;
        });

        this.loadUnreadCount();
    }

    toggleSidebar(): void {
        this.sidebarOpen = !this.sidebarOpen;
    }

    toggleTheme(): void {
        this.themeService.toggleDarkMode();
    }

    toggleNotifications(): void {
        this.router.navigate(['/notifications']);
    }

    loadUnreadCount(): void {
        this.notificationService.getUnreadCount().subscribe(count => {
            this.unreadCount = count;
        });
    }

    getUserInitials(): string {
        if (!this.currentUser?.fullName) return 'U';
        return this.currentUser.fullName
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    logout(): void {
        this.authService.logout();
    }
}