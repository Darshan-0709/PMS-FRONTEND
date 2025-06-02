import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, Observable, throwError } from 'rxjs';
import { map, takeUntil, shareReplay, catchError } from 'rxjs/operators';

import { ToastComponent } from '../../shared/components/toast/toast.component';
import { SharedInputComponent } from '../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../shared/components/validation-errors/validation-errors.component';
import {
  DropdownAutocompleteComponentComponent,
  SelectOption,
} from '../../shared/components/dropdown-autocomplete/dropdown-autocomplete.component';

import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../services/common.service';
import { PlacementCellService } from '../../services/placement-cell.service';
import { ToastService } from '../../services/toast.service';

import { defaultValidationMessages } from '../../types/validation.types';
import { PlacementCell, PlacementCellUpdateRequest } from '../../types/placement-cell.types';
import { Branch, Degree } from '../../register/register.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ToastComponent,
    ReactiveFormsModule,
    SharedInputComponent,
    ValidationErrorsComponent,
    DropdownAutocompleteComponentComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  // ───── PUBLIC FIELDS ─────────────────────────────────────────────────────────
  validationMessages = defaultValidationMessages;
  // profile$: Observable<PlacementCell>;
  isEditMode = signal<boolean>(true);

  branches$!: Observable<SelectOption<string>[]>;
  degreeOptions$ = new Observable<SelectOption<string>[]>();

  // Tracks original degree IDs to prevent deletion of “protected” degrees
  initialPlacementCellDegrees = signal<string[]>([]);

  // Raw arrays to look up labels/ids locally
  branches: Branch[] = [];
  degrees: Degree[] = [];

  // ───── PRIVATE FIELDS ────────────────────────────────────────────────────────
  private authService = inject(AuthService);
  private commonService = inject(CommonService);
  private placementCellService = inject(PlacementCellService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  private placementCellId: string | null = this.authService.currentUser()?.placementCellId || null;
  private placementCellData: PlacementCell | null = null;

  // ───── FORM DEFINITION ───────────────────────────────────────────────────────
  placementCellForm = new FormGroup({
    placementCellName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    placementCellEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    website: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^https?:\/\/[^\s$.?#].[^\s]*$/)],
    }),
    domain: new FormControl('', {
      nonNullable: true,
    }),
    domains: new FormControl<string[]>([], {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    placementCellDegrees: new FormControl<Degree[]>([], {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1)],
    }),
    // NOTE: We store Branch *IDs* in this control for payload consistency
    branch: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  // ───── LIFECYCLE HOOKS ───────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadRecruiterData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ───── PUBLIC EVENT HANDLERS ─────────────────────────────────────────────────

  /**
   * Triggered when the user confirms “Save” on the form.
   * Validates, constructs payload, invokes update service, and handles success/error.
   */
  onSubmit(): void {
    if (this.placementCellForm.invalid) {
      this.toastService.show('Please fill all required fields correctly', 'error');
      return;
    }

    if (!this.placementCellId) {
      this.toastService.show('Unable to identify placement cell. Please log in again.', 'error');
      return;
    }

    // Extract raw values
    const formValues = this.placementCellForm.getRawValue();

    // Compute update payload
    const updatePayload: PlacementCellUpdateRequest = {
      placementCellName: formValues.placementCellName,
      placementCellEmail: formValues.placementCellEmail,
      website: formValues.website,
      domains: formValues.domains,
      degrees: formValues.placementCellDegrees.map(d => d.degreeId),
      branchId: formValues.branch, // Already an ID
    };

    // Invoke API
    this.placementCellService
      .updatePlacementCell(this.placementCellId, updatePayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: updated => {
          this.placementCellData = updated;
          this.toastService.show('Profile updated successfully', 'success');
          this.resetForm();
          this.isEditMode.set(false);
        },
        error: errors => {
          // Map server‐side field errors to form controls
          Object.entries(errors || {}).forEach(([field, msg]) => {
            const control = this.placementCellForm.get(field);
            if (control) {
              control.setErrors({ server: msg });
              control.markAsTouched();
              control.markAsDirty();
            }
          });
        },
      });
  }

  /**
   * Called when a new branch is selected from the dropdown.
   * @param branchId The ID of the chosen branch.
   */
  onBranchSelected(branchId: string): void {
    // Find by strict comparison
    const selectedBranch = this.branches.find(b => b.branchId === branchId);
    if (selectedBranch) {
      this.branchControl.setValue(selectedBranch.branchId);
    }
  }

  /**
   * Adds a domain after prefixing “@” if missing.
   * Ensures no duplicates and updates the FormControl state accordingly.
   */
  onDomainAdd(): void {
    let newDomain = this.domainInputControl.value.trim();
    if (!newDomain) {
      return;
    }
    if (!newDomain.startsWith('@')) {
      newDomain = '@' + newDomain;
    }

    const currentDomains = this.placementCellDomains.value || [];
    if (!currentDomains.includes(newDomain)) {
      const updated = [...currentDomains, newDomain];
      this.placementCellDomains.setValue(updated);
      this.placementCellDomains.markAsDirty();
      this.placementCellDomains.markAsTouched();
      this.domainInputControl.setValue('');
    }
  }

  /**
   * Removes a domain from the list. If it becomes empty, sets the required error.
   * @param domain The domain string to remove.
   */
  onRemoveDomain(domain: string): void {
    const current: string[] = this.placementCellDomains.value || [];
    const updated = current.filter(d => d !== domain);

    this.placementCellDomains.setValue(updated);
    this.placementCellDomains.markAsDirty();
    this.placementCellDomains.markAsTouched();

    if (updated.length === 0) {
      this.placementCellDomains.setErrors({ required: true });
    }
  }

  /**
   * Adds a degree to the user’s selection, ensuring no duplicates.
   * @param degreeId The ID of the degree to add.
   */
  onDomainAdded(degreeId: string): void {
    const currentDegrees: Degree[] = this.placementCellDegrees.value;
    // If already included, do nothing
    if (currentDegrees.some(d => d.degreeId === degreeId)) {
      return;
    }

    const found = this.degrees.find(d => d.degreeId === degreeId);
    if (found) {
      const updated = [...currentDegrees, found];
      this.placementCellDegrees.setValue(updated);
      this.placementCellDegrees.markAsDirty();
      this.placementCellDegrees.markAsTouched();
      // Clear validation once there is at least one degree
      if (updated.length > 0) {
        this.placementCellDegrees.setErrors(null);
      }
    }
  }

  /**
   * Removes a degree, but prevents removal if it was originally loaded from the backend.
   * @param degreeId The ID of the degree to remove.
   */
  onRemoveDegree(degreeId: string): void {
    const wasOriginal = this.initialPlacementCellDegrees().includes(degreeId);
    if (wasOriginal) {
      this.toastService.show('Cannot remove degrees with associated students', 'warning');
      return;
    }

    const currentDegrees: Degree[] = this.placementCellDegrees.value;
    const updated = currentDegrees.filter(d => d.degreeId !== degreeId);

    this.placementCellDegrees.setValue(updated);
    this.placementCellDegrees.markAsDirty();
    this.placementCellDegrees.markAsTouched();

    if (updated.length === 0) {
      this.placementCellDegrees.setErrors({ required: true });
    }
  }

  /**
   * Toggles edit mode on.
   */
  onEdit(): void {
    this.isEditMode.set(true);
    this.toastService.show('Edit mode enabled', 'info');
  }

  /**
   * Cancels any edits and reverts form to its last‐loaded state.
   */
  onCancel(): void {
    this.resetForm();
    this.isEditMode.set(false);
    this.toastService.show('Edit cancelled', 'warning');
  }

  // ───── PRIVATE HELPERS ────────────────────────────────────────────────────────

  /**
   * Handles HTTP‐level errors, mapping them if possible into a field‐error object.
   * @param err The HttpErrorResponse caught by catchError.
   */
  private handleError(err: any): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (err.error?.message) {
      errorMessage = err.error.message;
      if (err.error.errors && Object.keys(err.error.errors).length !== 0) {
        // If the server returned a structured error map, rethrow for onSubmit() to assign
        return throwError(() => err.error.errors);
      }
    }
    this.toastService.show(errorMessage, 'error');
    return throwError(() => err);
  }

  /**
   * Loads the current placement cell’s data, patches the form, and initializes dropdown data streams.
   */
  private loadRecruiterData(): void {
    if (!this.placementCellId) {
      return;
    }

    this.placementCellService
      .getPlacementCell(this.placementCellId)
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => this.handleError(err))
      )
      .subscribe(profile => {
        // Track original degree IDs to prevent forced removals
        this.initialPlacementCellDegrees.set(profile.placementCellDegrees.map(deg => deg.degreeId));

        this.placementCellData = profile;
        this.resetForm();

        // Populate branches$ for dropdown autocomplete
        this.branches$ = this.commonService.getBranches().pipe(
          map(branchesArray => {
            this.branches = branchesArray;

            return branchesArray.map(branch => ({
              value: branch.branchId,
              label: branch.name,
              select: this.branchControl.value === branch.name,
            }));
          }),
          shareReplay(1)
        );

        // Populate degreeOptions$ for dropdown autocomplete
        this.degreeOptions$ = this.commonService.getDegrees().pipe(
          map(degreesArray => {
            this.degrees = degreesArray;
            return degreesArray.map(deg => ({
              value: deg.degreeId,
              label: deg.name,
            }));
          })
        );
      });
  }

  /**
   * Resets the form back to the last‐loaded `placementCellData`.
   * Converts `branch` into its ID so that the form control remains consistent.
   */
  private resetForm(): void {
    if (!this.placementCellData) {
      return;
    }

    // Build a patch object matching form‐control keys exactly
    const patchData = {
      placementCellName: this.placementCellData.placementCellName,
      placementCellEmail: this.placementCellData.placementCellEmail,
      website: this.placementCellData.website,
      // We leave “domain” (the input) empty; only “domains” gets patched
      domain: '',
      domains: [...this.placementCellData.domains],
      placementCellDegrees: [...this.placementCellData.placementCellDegrees],
      branch: this.placementCellData.branch.name, // Always set ID
    };

    this.placementCellForm.patchValue(patchData);
  }

  // ───── FORM CONTROL GETTERS ──────────────────────────────────────────────────

  get placementCellNameControl(): FormControl {
    return this.placementCellForm.get('placementCellName') as FormControl;
  }

  get placementCellEmailControl(): FormControl {
    return this.placementCellForm.get('placementCellEmail') as FormControl;
  }

  get websiteControl(): FormControl {
    return this.placementCellForm.get('website') as FormControl;
  }

  get domainInputControl(): FormControl {
    return this.placementCellForm.get('domain') as FormControl;
  }

  get placementCellDomains(): FormControl {
    return this.placementCellForm.get('domains') as FormControl;
  }

  get placementCellDegrees(): FormControl {
    return this.placementCellForm.get('placementCellDegrees') as FormControl;
  }

  get branchControl(): FormControl {
    return this.placementCellForm.get('branch') as FormControl;
  }
}
