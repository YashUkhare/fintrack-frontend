// src/app/features/categories/categories.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category, CategoryRequest } from '../../core/models/category.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Organize your transactions</p>
        </div>
        <button (click)="openModal()"
                class="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg
                       transition-all flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      <!-- Categories Lists -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Income Categories -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            Income Categories
          </h2>
          <div class="space-y-2">
            <div *ngFor="let category of incomeCategories"
                 class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700
                        hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                     [style.backgroundColor]="category.color + '20'">
                  {{category.icon}}
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">{{category.name}}</h3>
                  <p *ngIf="category.description" class="text-sm text-gray-500 dark:text-gray-400">
                    {{category.description}}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span *ngIf="category.isDefault" 
                      class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">
                  Default
                </span>
                <button *ngIf="!category.isDefault" (click)="editCategory(category)"
                        class="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button *ngIf="!category.isDefault" (click)="deleteCategory(category.id)"
                        class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Expense Categories -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
            Expense Categories
          </h2>
          <div class="space-y-2">
            <div *ngFor="let category of expenseCategories"
                 class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700
                        hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                     [style.backgroundColor]="category.color + '20'">
                  {{category.icon}}
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">{{category.name}}</h3>
                  <p *ngIf="category.description" class="text-sm text-gray-500 dark:text-gray-400">
                    {{category.description}}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span *ngIf="category.isDefault" 
                      class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">
                  Default
                </span>
                <button *ngIf="!category.isDefault" (click)="editCategory(category)"
                        class="p-2 text-gray-400 hover:text-primary-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button *ngIf="!category.isDefault" (click)="deleteCategory(category.id)"
                        class="p-2 text-gray-400 hover:text-red-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div *ngIf="showModal" class="fixed inset-0 z-50 overflow-y-auto" (click)="closeModal()">
      <div class="flex items-center justify-center min-h-screen px-4">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
        <div (click)="$event.stopPropagation()"
             class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{editingCategory ? 'Edit Category' : 'Add Category'}}
              </h3>
            </div>
            <div class="px-6 py-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                <div class="grid grid-cols-2 gap-3">
                  <button type="button"
                          (click)="categoryForm.patchValue({type: 'INCOME'})"
                          [class.bg-green-500]="categoryForm.get('type')?.value === 'INCOME'"
                          [class.text-white]="categoryForm.get('type')?.value === 'INCOME'"
                          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
                    Income
                  </button>
                  <button type="button"
                          (click)="categoryForm.patchValue({type: 'EXPENSE'})"
                          [class.bg-red-500]="categoryForm.get('type')?.value === 'EXPENSE'"
                          [class.text-white]="categoryForm.get('type')?.value === 'EXPENSE'"
                          class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600">
                    Expense
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category Name
                </label>
                <input type="text" formControlName="name" placeholder="e.g., Groceries"
                       class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:ring-2 focus:ring-primary-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea formControlName="description" rows="2"
                          class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 focus:ring-2 focus:ring-primary-500"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon (Emoji)
                </label>
                <input type="text" formControlName="icon" placeholder="🛒"
                       class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              focus:ring-2 focus:ring-primary-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <input type="color" formControlName="color"
                       class="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600">
              </div>
            </div>
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex gap-3 justify-end">
              <button type="button" (click)="closeModal()"
                      class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                Cancel
              </button>
              <button type="submit" [disabled]="categoryForm.invalid || saving"
                      class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg">
                {{saving ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
    categories: Category[] = [];
    showModal = false;
    saving = false;
    editingCategory: Category | null = null;

    categoryForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private categoryService: CategoryService,
        private toastr: ToastrService
    ) {
        this.categoryForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            type: ['EXPENSE', Validators.required],
            icon: ['📁'],
            color: ['#3b82f6']
        });
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    get incomeCategories(): Category[] {
        return this.categories.filter(c => c.type === 'INCOME');
    }

    get expenseCategories(): Category[] {
        return this.categories.filter(c => c.type === 'EXPENSE');
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (data) => {
                this.categories = data;
            }
        });
    }

    openModal(): void {
        this.editingCategory = null;
        this.categoryForm.reset({
            type: 'EXPENSE',
            icon: '📁',
            color: '#3b82f6'
        });
        this.showModal = true;
    }

    editCategory(category: Category): void {
        this.editingCategory = category;
        this.categoryForm.patchValue(category);
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
    }

    onSubmit(): void {
        if (this.categoryForm.valid && !this.saving) {
            this.saving = true;
            const request: CategoryRequest = this.categoryForm.value;
            const operation = this.editingCategory
                ? this.categoryService.updateCategory(this.editingCategory.id, request)
                : this.categoryService.createCategory(request);

            operation.subscribe({
                next: () => {
                    this.saving = false;
                    this.closeModal();
                    this.loadCategories();
                    this.toastr.success('Category saved successfully');
                },
                error: () => {
                    this.saving = false;
                    this.toastr.error('Failed to save category');
                }
            });
        }
    }

    deleteCategory(id: number): void {
        if (confirm('Are you sure? This will affect existing transactions.')) {
            this.categoryService.deleteCategory(id).subscribe({
                next: () => {
                    this.loadCategories();
                    this.toastr.success('Category deleted');
                },
                error: () => {
                    this.toastr.error('Cannot delete category with existing transactions');
                }
            });
        }
    }
}