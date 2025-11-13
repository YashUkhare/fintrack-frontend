// src/app/features/budgets/budgets.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '../../core/services/budget.service';
import { CategoryService } from '../../core/services/category.service';
import { Budget, BudgetRequest } from '../../core/models/budget.model';
import { Category } from '../../core/models/category.model';
import { ToastrService } from 'ngx-toastr';
import { format, startOfMonth, endOfMonth } from 'date-fns';

@Component({
    selector: 'app-budgets',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './budgets.component.html',
    styles: []
})
export class BudgetsComponent implements OnInit {
    budgets: Budget[] = [];
    categories: Category[] = [];
    loading = true;
    showModal = false;
    saving = false;
    editingBudget: Budget | null = null;
    Math = Math;

    budgetForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private budgetService: BudgetService,
        private categoryService: CategoryService,
        private toastr: ToastrService
    ) {
        this.budgetForm = this.fb.group({
            categoryId: ['', Validators.required],
            amount: ['', [Validators.required, Validators.min(0.01)]],
            startDate: [format(startOfMonth(new Date()), 'yyyy-MM-dd'), Validators.required],
            endDate: [format(endOfMonth(new Date()), 'yyyy-MM-dd'), Validators.required],
            alertThreshold: [80, [Validators.required, Validators.min(0), Validators.max(100)]]
        });
    }

    ngOnInit(): void {
        this.loadCategories();
        this.loadBudgets();
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (data) => {
                this.categories = data;
            }
        });
    }

    get expenseCategories(): Category[] {
        return this.categories.filter(c => c.type === 'EXPENSE');
    }

    loadBudgets(): void {
        this.loading = true;
        this.budgetService.getBudgets().subscribe({
            next: (data) => {
                this.budgets = data;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.toastr.error('Failed to load budgets');
            }
        });
    }

    openModal(): void {
        this.editingBudget = null;
        this.budgetForm.reset({
            startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
            endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
            alertThreshold: 80
        });
        this.showModal = true;
    }

    editBudget(budget: Budget): void {
        this.editingBudget = budget;
        this.budgetForm.patchValue({
            categoryId: budget.categoryId,
            amount: budget.amount,
            startDate: budget.startDate,
            endDate: budget.endDate,
            alertThreshold: budget.alertThreshold
        });
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.editingBudget = null;
    }

    onSubmit(): void {
        if (this.budgetForm.valid && !this.saving) {
            this.saving = true;
            const request: BudgetRequest = this.budgetForm.value;

            const operation = this.editingBudget
                ? this.budgetService.updateBudget(this.editingBudget.id, request)
                : this.budgetService.createBudget(request);

            operation.subscribe({
                next: () => {
                    this.saving = false;
                    this.closeModal();
                    this.loadBudgets();
                    this.toastr.success(
                        this.editingBudget ? 'Budget updated' : 'Budget created',
                        'Success'
                    );
                },
                error: () => {
                    this.saving = false;
                    this.toastr.error('Operation failed');
                }
            });
        }
    }

    deleteBudget(id: number): void {
        if (confirm('Are you sure you want to delete this budget?')) {
            this.budgetService.deleteBudget(id).subscribe({
                next: () => {
                    this.loadBudgets();
                    this.toastr.success('Budget deleted');
                },
                error: () => {
                    this.toastr.error('Failed to delete budget');
                }
            });
        }
    }
}