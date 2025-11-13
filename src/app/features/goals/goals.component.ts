// src/app/features/goals/goals.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoalService } from '../../core/services/goal.service';
import { Goal, GoalRequest } from '../../core/models/goal.model';
import { ToastrService } from 'ngx-toastr';
import { format, addMonths } from 'date-fns';

@Component({
    selector: 'app-goals',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './goals.component.html',
})
export class GoalsComponent implements OnInit {
    goals: Goal[] = [];
    showModal = false;
    showProgressModal = false;
    saving = false;
    editingGoal: Goal | null = null;
    selectedGoal: Goal | null = null;
    progressAmount: number = 0;
    Math = Math;

    goalForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private goalService: GoalService,
        private toastr: ToastrService
    ) {
        this.goalForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            targetAmount: ['', [Validators.required, Validators.min(0.01)]],
            targetDate: [format(addMonths(new Date(), 6), 'yyyy-MM-dd'), Validators.required],
            icon: ['🎯']
        });
    }

    ngOnInit(): void {
        this.loadGoals();
    }

    loadGoals(): void {
        this.goalService.getGoals().subscribe({
            next: (data) => {
                this.goals = data;
            }
        });
    }

    openModal(): void {
        this.editingGoal = null;
        this.goalForm.reset({
            targetDate: format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
            icon: '🎯'
        });
        this.showModal = true;
    }

    editGoal(goal: Goal): void {
        this.editingGoal = goal;
        this.goalForm.patchValue(goal);
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
    }

    onSubmit(): void {
        if (this.goalForm.valid && !this.saving) {
            this.saving = true;
            const request: GoalRequest = this.goalForm.value;
            const operation = this.editingGoal
                ? this.goalService.updateGoal(this.editingGoal.id, request)
                : this.goalService.createGoal(request);

            operation.subscribe({
                next: () => {
                    this.saving = false;
                    this.closeModal();
                    this.loadGoals();
                    this.toastr.success('Goal saved successfully');
                },
                error: () => {
                    this.saving = false;
                    this.toastr.error('Failed to save goal');
                }
            });
        }
    }

    addProgress(goal: Goal): void {
        this.selectedGoal = goal;
        this.progressAmount = 0;
        this.showProgressModal = true;
    }

    closeProgressModal(): void {
        this.showProgressModal = false;
        this.selectedGoal = null;
    }

    submitProgress(): void {
        if (this.selectedGoal && this.progressAmount > 0) {
            this.goalService.updateProgress(this.selectedGoal.id, this.progressAmount).subscribe({
                next: () => {
                    this.closeProgressModal();
                    this.loadGoals();
                    this.toastr.success('Progress updated!');
                },
                error: () => {
                    this.toastr.error('Failed to update progress');
                }
            });
        }
    }

    deleteGoal(id: number): void {
        if (confirm('Are you sure you want to delete this goal?')) {
            this.goalService.deleteGoal(id).subscribe({
                next: () => {
                    this.loadGoals();
                    this.toastr.success('Goal deleted');
                }
            });
        }
    }
}