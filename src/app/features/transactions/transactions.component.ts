// src/app/features/transactions/transactions.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { CategoryService } from '../../core/services/category.service';
import { Transaction, TransactionRequest, PaymentMethod } from '../../core/models/transaction.model';
import { Category } from '../../core/models/category.model';
import { ToastrService } from 'ngx-toastr';
import { format } from 'date-fns';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule , FormsModule],
    templateUrl: './transactions.component.html',
    styles: []
})
export class TransactionsComponent implements OnInit {
    transactions: Transaction[] = [];
    filteredTransactions: Transaction[] = [];
    categories: Category[] = [];
    loading = true;
    showModal = false;
    saving = false;
    editingTransaction: Transaction | null = null;

    // Pagination
    currentPage = 0;
    pageSize = 20;
    totalPages = 0;
    totalElements = 0;
    Math = Math;

    // Filters
    searchQuery = '';
    filterType = '';
    filterCategory = '';
    filterPaymentMethod = '';

    transactionForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private transactionService: TransactionService,
        private categoryService: CategoryService,
        private toastr: ToastrService
    ) {
        this.transactionForm = this.fb.group({
            type: ['EXPENSE', Validators.required],
            amount: ['', [Validators.required, Validators.min(0.01)]],
            description: [''],
            transactionDate: [format(new Date(), 'yyyy-MM-dd'), Validators.required],
            categoryId: ['', Validators.required],
            paymentMethod: ['CASH', Validators.required],
            isRecurring: [false],
            tags: [[]]
        });
    }

    ngOnInit(): void {
        this.loadCategories();
        this.loadTransactions();
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (data) => {
                this.categories = data;
            }
        });
    }

    loadTransactions(): void {
        this.loading = true;
        this.transactionService.getTransactions(this.currentPage, this.pageSize).subscribe({
            next: (data) => {
                this.transactions = data.content;
                this.filteredTransactions = data.content;
                this.totalPages = data.totalPages;
                this.totalElements = data.totalElements;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.toastr.error('Failed to load transactions');
            }
        });
    }

    get filteredCategories(): Category[] {
        const type = this.transactionForm.get('type')?.value;
        return this.categories.filter(c => c.type === type);
    }

    applyFilters(): void {
        let filtered = [...this.transactions];

        if (this.searchQuery) {
            filtered = filtered.filter(t =>
                t.description?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                t.categoryName.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        if (this.filterType) {
            filtered = filtered.filter(t => t.type === this.filterType);
        }

        if (this.filterCategory) {
            filtered = filtered.filter(t => t.categoryId.toString() === this.filterCategory);
        }

        if (this.filterPaymentMethod) {
            filtered = filtered.filter(t => t.paymentMethod === this.filterPaymentMethod);
        }

        this.filteredTransactions = filtered;
    }

    openModal(): void {
        this.editingTransaction = null;
        this.transactionForm.reset({
            type: 'EXPENSE',
            transactionDate: format(new Date(), 'yyyy-MM-dd'),
            paymentMethod: 'CASH',
            isRecurring: false
        });
        this.showModal = true;
    }

    editTransaction(transaction: Transaction): void {
        this.editingTransaction = transaction;
        this.transactionForm.patchValue({
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            transactionDate: transaction.transactionDate,
            categoryId: transaction.categoryId,
            paymentMethod: transaction.paymentMethod,
            isRecurring: transaction.isRecurring
        });
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.editingTransaction = null;
    }

    onSubmit(): void {
        if (this.transactionForm.valid && !this.saving) {
            this.saving = true;
            const request: TransactionRequest = this.transactionForm.value;

            const operation = this.editingTransaction
                ? this.transactionService.updateTransaction(this.editingTransaction.id, request)
                : this.transactionService.createTransaction(request);

            operation.subscribe({
                next: () => {
                    this.saving = false;
                    this.closeModal();
                    this.loadTransactions();
                    this.toastr.success(
                        this.editingTransaction ? 'Transaction updated' : 'Transaction created',
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

    deleteTransaction(id: number): void {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactionService.deleteTransaction(id).subscribe({
                next: () => {
                    this.loadTransactions();
                    this.toastr.success('Transaction deleted');
                },
                error: () => {
                    this.toastr.error('Failed to delete transaction');
                }
            });
        }
    }

    changePage(page: number): void {
        if (page >= 0 && page < this.totalPages) {
            this.currentPage = page;
            this.loadTransactions();
        }
    }

    getPageNumbers(): number[] {
        const pages: number[] = [];
        const maxPages = 5;
        let start = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
        let end = Math.min(this.totalPages, start + maxPages);

        if (end - start < maxPages) {
            start = Math.max(0, end - maxPages);
        }

        for (let i = start; i < end; i++) {
            pages.push(i);
        }
        return pages;
    }

    formatPaymentMethod(method: PaymentMethod): string {
        return method.replace(/_/g, ' ').toLowerCase()
            .replace(/\b\w/g, l => l.toUpperCase());
    }
}