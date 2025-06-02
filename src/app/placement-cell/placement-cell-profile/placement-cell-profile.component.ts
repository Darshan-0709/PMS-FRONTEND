import { OnChanges, SimpleChanges } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedInputComponent } from '../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../shared/components/validation-errors/validation-errors.component';
import { DropdownAutocompleteComponentComponent } from '../../shared/components/dropdown-autocomplete/dropdown-autocomplete.component';

@Component({
  selector: 'app-placement-cell-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedInputComponent,
    ValidationErrorsComponent,
    DropdownAutocompleteComponentComponent,
  ],
  // templateUrl: './placement-cell-profile.component.html',
  template: '<h1>Placement Cell Profile</h1>',
  styleUrls: ['./placement-cell-profile.component.css'],
})
export class PlacementCellProfileComponent implements OnInit, OnChanges {
  // @Input() placementCellId!: string;

  // private fb = inject(FormBuilder);
  // private profileService = inject(PlacementCellProfileService);
  // private toastService = inject(ToastService);
  // private registerApiService = inject(RegisterAPIService);

  // profileForm!: FormGroup;
  // validationMessages = defaultValidationMessages;
  // isInitialized = signal(false);
  // isLoading = signal(true);
  // formReady = signal(false);

  // profile$ = this.profileService.profile$;
  // isEditMode$ = this.profileService.isEditMode$;

  // // Local state
  // currentEditMode = signal(false);

  // // Domain state management
  // domains = signal<string[]>([]); // UI state for display
  // serverDomains = signal<string[]>([]); // Original domain state from server
  // showDomainError = signal(false);

  // // Degree state management
  // degrees = signal<SelectOption<string>[]>([]); // All available degrees
  // selectedDegrees = signal<string[]>([]); // UI state for display
  // serverDegrees = signal<string[]>([]); // Original degree IDs from server
  // degreeLabels = signal<Map<string, string>>(new Map()); // Map of degreeId to degree name
  // showDegreeError = signal(false);

  // // Validation messages for array validators
  // arrayValidationMessages = {
  //   domains: 'At least one domain is required',
  //   degrees: 'At least one degree is required',
  // };

  // // Computed value for field editability
  // canEditField = computed(() => {
  //   const editMode = this.currentEditMode();

  //   return {
  //     placementCellName: editMode,
  //     placementCellEmail: editMode,
  //     website: editMode,
  //     domains: editMode,
  //     degrees: editMode,
  //     branchName: false,
  //   };
  // });
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}
  // ngOnInit(): void {
  //   // Initialize the form but don't load data yet
  //   this.initializeForm();

  //   // Load degrees during initialization, not just in edit mode
  //   this.loadDegrees();

  //   // Only load profile if ID is provided during initialization
  //   if (this.placementCellId) {
  //     this.isInitialized.set(true);
  //     this.loadProfile();
  //   }

  //   // Subscribe to profile changes to update form
  //   this.profile$.subscribe((profile) => {
  //     if (profile && this.formReady()) {
  //       this.updateFormValues(profile);
  //       this.isLoading.set(false);

  //       // Extract domains for display and store original server state
  //       if (
  //         profile.placementCellDomains &&
  //         profile.placementCellDomains.length > 0
  //       ) {
  //         const domainValues = profile.placementCellDomains.map(
  //           (d) => d.domain
  //         );
  //         this.domains.set(domainValues);
  //         this.serverDomains.set([...domainValues]);

  //         const domainsCtrl = this.domainsControl;
  //         if (domainsCtrl) {
  //           domainsCtrl.setValue(domainValues);
  //         }
  //       }

  //       // Extract degree IDs for display and store original server state
  //       if (
  //         profile.placementCellDegrees &&
  //         profile.placementCellDegrees.length > 0
  //       ) {
  //         const degreeIds = profile.placementCellDegrees.map(
  //           (d) => d.degree.degreeId
  //         );

  //         // Update the degree labels map with the degree names from the profile
  //         const labelMap = new Map(this.degreeLabels());
  //         profile.placementCellDegrees.forEach((degree) => {
  //           labelMap.set(degree.degree.degreeId, degree.degree.name);
  //         });
  //         this.degreeLabels.set(labelMap);

  //         this.selectedDegrees.set(degreeIds);
  //         this.serverDegrees.set([...degreeIds]);

  //         const degreesCtrl = this.degreesControl;
  //         if (degreesCtrl) {
  //           degreesCtrl.setValue(degreeIds);
  //         }
  //       }
  //     }
  //   });

  //   // Subscribe to edit mode changes to handle form state
  //   this.isEditMode$.subscribe((isEdit) => {
  //     // Update local signal with Observable value
  //     this.currentEditMode.set(isEdit);

  //     if (isEdit && this.formReady()) {
  //       this.enableFormControls();
  //     } else if (this.formReady()) {
  //       this.disableFormControls();
  //     }
  //   });
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   // If placementCellId changes and is now defined, and we haven't initialized yet
  //   if (
  //     changes['placementCellId'] &&
  //     changes['placementCellId'].currentValue &&
  //     !this.isInitialized()
  //   ) {
  //     this.isInitialized.set(true);
  //     this.loadProfile();
  //   }
  // }

  // private loadDegrees(): void {
  //   if (this.degrees().length === 0) {
  //     this.registerApiService.fetchDegrees().subscribe({
  //       next: (response) => {
  //         if (response) {
  //           const degreeOptions = response.map((degree: Degree) => ({
  //             label: degree.name,
  //             value: degree.degreeId,
  //           }));

  //           this.degrees.set(degreeOptions);

  //           // Update the degree labels map
  //           const labelMap = new Map();
  //           degreeOptions.forEach((option) => {
  //             labelMap.set(option.value, option.label);
  //           });
  //           this.degreeLabels.set(labelMap);
  //         }
  //       },
  //       error: (error: Error) => {
  //         this.toastService.show(
  //           'Failed to load degrees: ' + error.message,
  //           'error'
  //         );
  //       },
  //     });
  //   }
  // }

  // // Get degree name by ID for display in view mode
  // getDegreeNameById(degreeId: string): string {
  //   return this.degreeLabels().get(degreeId) || 'Unknown Degree';
  // }

  // private initializeForm(): void {
  //   try {
  //     this.profileForm = this.fb.group({
  //       placementCellName: [{ value: '', disabled: true }],
  //       placementCellEmail: ['', [Validators.required, Validators.email]],
  //       website: [
  //         '',
  //         [
  //           Validators.required,
  //           Validators.pattern(/^https?:\/\/[^\s$.?#].[^\s]*$/),
  //         ],
  //       ],
  //       domainInput: [''], // For domain input field
  //       domains: [[], [Validators.required]], // Array of domains
  //       degrees: [[], [Validators.required]], // Array of degree IDs
  //       branchName: [{ value: '', disabled: true }],
  //     });

  //     // Initially disable the form
  //     this.disableFormControls();

  //     // Signal that the form is ready
  //     this.formReady.set(true);
  //   } catch (error) {
  //     console.error('Error initializing form:', error);
  //     this.toastService.show('Error initializing form', 'error');
  //   }
  // }

  // private loadProfile(): void {
  //   if (!this.placementCellId) {
  //     this.toastService.show('No placement cell ID provided', 'error');
  //     this.isLoading.set(false);
  //     return;
  //   }

  //   this.isLoading.set(true);
  //   if (this.placementCellId) {
  //     this.profileService.getProfile(this.placementCellId).subscribe({
  //       next: (profile) => {
  //         // Success handling is done in the service via tap operator
  //         // this.toastService.show('Profile loaded successfully', 'success');
  //         this.isLoading.set(false);
  //       },
  //       error: (error) => {
  //         this.toastService.show(
  //           'Failed to load profile: ' + error.message,
  //           'error'
  //         );
  //         this.isLoading.set(false);
  //       },
  //     });
  //   }
  // }

  // private updateFormValues(profile: PlacementCellProfile): void {
  //   if (!this.formReady() || !this.profileForm) {
  //     return;
  //   }

  //   try {

  //     console.log(profile)
  //     this.profileForm.patchValue({
  //       placementCellName: profile.placementCellName,
  //       placementCellEmail: profile.placementCellEmail,
  //       website: profile.website,
  //       branchName: profile.branch.name,
  //     });
  //   } catch (error) {
  //     console.error('Error updating form values:', error);
  //   }
  // }

  // private enableFormControls(): void {
  //   if (!this.formReady() || !this.profileForm) {
  //     return;
  //   }

  //   try {
  //     // Enable editable fields
  //     this.profileForm.get('placementCellEmail')?.enable();
  //     this.profileForm.get('website')?.enable();
  //     this.profileForm.get('domainInput')?.enable();
  //     this.profileForm.get('domains')?.enable();
  //     this.profileForm.get('degrees')?.enable();
  //   } catch (error) {
  //     console.error('Error enabling form controls:', error);
  //   }
  // }

  // private disableFormControls(): void {
  //   if (!this.formReady() || !this.profileForm) {
  //     return;
  //   }

  //   try {
  //     // Disable all controls
  //     Object.keys(this.profileForm.controls).forEach((key) => {
  //       this.profileForm.get(key)?.disable();
  //     });
  //   } catch (error) {
  //     console.error('Error disabling form controls:', error);
  //   }
  // }

  // onEdit(): void {
  //   this.profileService.setEditMode(true);
  // }

  // onCancel(): void {
  //   if (!this.formReady()) {
  //     return;
  //   }

  //   // Reset to server state
  //   this.domains.set([...this.serverDomains()]);
  //   this.selectedDegrees.set([...this.serverDegrees()]);

  //   if (this.domainsControl) {
  //     this.domainsControl.setValue(this.serverDomains());
  //   }

  //   if (this.degreesControl) {
  //     this.degreesControl.setValue(this.serverDegrees());
  //   }

  //   this.profileService.resetProfile();
  //   this.toastService.show('Edit cancelled', 'info');
  // }

  // onSubmit(): void {
  //   if (!this.formReady() || !this.profileForm) {
  //     return;
  //   }

  //   if (this.profileForm.invalid) {
  //     // Mark all fields as touched to show validation errors
  //     Object.keys(this.profileForm.controls).forEach((key) => {
  //       const control = this.profileForm.get(key);
  //       if (control) {
  //         control.markAsTouched();
  //         control.markAsDirty();
  //       }
  //     });

  //     // Check specific array validations
  //     if (!this.domains() || this.domains().length === 0) {
  //       this.domainsControl?.setErrors({ required: true });
  //       this.showDomainError.set(true);
  //     }

  //     if (!this.selectedDegrees() || this.selectedDegrees().length === 0) {
  //       this.degreesControl?.setErrors({ required: true });
  //       this.showDegreeError.set(true);
  //     }

  //     this.toastService.show(
  //       'Please fill all required fields correctly',
  //       'error'
  //     );
  //     return;
  //   }

  //   const formValues = this.profileForm.getRawValue();

  //   // Create update payload - ensure it matches the backend expected format
  //   const updatePayload: PlacementCellUpdatePayload = {
  //     placementCellEmail: formValues.placementCellEmail,
  //     website: formValues.website,
  //     domains: this.domains(),
  //     degrees: this.selectedDegrees(),
  //   };

  //   this.profileService
  //     .updateProfile(this.placementCellId, updatePayload)
  //     .subscribe({
  //       next: (response) => {
  //         // Update server state with new values on success
  //         this.serverDomains.set([...this.domains()]);
  //         this.serverDegrees.set([...this.selectedDegrees()]);

  //         this.toastService.show('Profile updated successfully', 'success');
  //         this.profileService.setEditMode(false);
  //       },
  //       error: (error) => {
  //         // Handle specific validation errors
  //         if (error.error?.errors) {
  //           const errors = error.error.errors;

  //           // Handle field-specific errors
  //           Object.entries(errors).forEach(([field, message]) => {
  //             const control = this.profileForm.get(field);
  //             if (control) {
  //               control.setErrors({ server: message });
  //             }

  //             // Special handling for domains and degrees
  //             if (field === 'domains') {
  //               this.domainsControl?.setErrors({ server: message });
  //               this.showDomainError.set(true);
  //             }
  //             if (field === 'degrees') {
  //               this.degreesControl?.setErrors({ server: message });
  //               this.showDegreeError.set(true);
  //             }
  //           });
  //         }

  //         this.toastService.show(
  //           'Failed to update profile: ' + error.message,
  //           'error'
  //         );
  //       },
  //     });
  // }

  // // Domain management methods
  // onDomainAdd(): void {
  //   if (!this.formReady()) {
  //     return;
  //   }

  //   let domainInputValue = this.domainInputControl?.value?.trim();
  //   const currentDomains = [...this.domains()];

  //   // Ensure @ is prefixed
  //   if (domainInputValue && !domainInputValue.startsWith('@')) {
  //     domainInputValue = '@' + domainInputValue;
  //   }

  //   if (domainInputValue && !currentDomains.includes(domainInputValue)) {
  //     const updatedDomains = [...currentDomains, domainInputValue];
  //     this.domains.set(updatedDomains);

  //     if (this.domainsControl) {
  //       this.domainsControl.setValue(updatedDomains);
  //       this.domainsControl.markAsDirty();
  //       this.domainsControl.markAsTouched();

  //       // Clear any domain validation errors when adding domains
  //       if (updatedDomains.length > 0) {
  //         this.domainsControl.setErrors(null);
  //       }
  //     }

  //     this.domainInputControl?.setValue('');
  //   }
  // }

  // onRemoveDomain(domain: string): void {
  //   if (!this.formReady()) {
  //     return;
  //   }

  //   const currentDomains = this.domains();
  //   const updatedDomains = currentDomains.filter((d) => d !== domain);
  //   this.domains.set(updatedDomains);

  //   if (this.domainsControl) {
  //     this.domainsControl.setValue(updatedDomains);
  //     this.domainsControl.markAsDirty();
  //     this.domainsControl.markAsTouched();

  //     // If all domains are removed, set validation error
  //     if (updatedDomains.length === 0) {
  //       this.domainsControl.setErrors({ required: true });
  //     }
  //   }
  // }

  // // Degree management methods
  // onDegreeSelected(degreeId: string): void {
  //   if (!this.formReady()) {
  //     return;
  //   }

  //   const currentDegrees = this.selectedDegrees();
  //   if (!currentDegrees.includes(degreeId)) {
  //     const updatedDegrees = [...currentDegrees, degreeId];
  //     this.selectedDegrees.set(updatedDegrees);

  //     if (this.degreesControl) {
  //       this.degreesControl.setValue(updatedDegrees);
  //       this.degreesControl.markAsDirty();
  //       this.degreesControl.markAsTouched();

  //       // Clear any degree validation errors when adding degrees
  //       if (updatedDegrees.length > 0) {
  //         this.degreesControl.setErrors(null);
  //         this.showDegreeError.set(false);
  //       }
  //     }
  //   }
  // }

  // onRemoveDegree(degreeId: string): void {
  //   if (!this.formReady()) {
  //     return;
  //   }

  //   // Check if this degree was in the original server list
  //   const isOriginalDegree = this.serverDegrees().includes(degreeId);

  //   // Cannot remove original degrees (backend constraint)
  //   if (isOriginalDegree) {
  //     this.toastService.show(
  //       'Cannot remove degrees that may have associated students',
  //       'warning'
  //     );
  //     return;
  //   }

  //   const currentDegrees = this.selectedDegrees();
  //   const updatedDegrees = currentDegrees.filter((d) => d !== degreeId);
  //   this.selectedDegrees.set(updatedDegrees);

  //   if (this.degreesControl) {
  //     this.degreesControl.setValue(updatedDegrees);
  //     this.degreesControl.markAsDirty();
  //     this.degreesControl.markAsTouched();

  //     // If all degrees are removed, set validation error
  //     if (updatedDegrees.length === 0) {
  //       this.degreesControl.setErrors({ required: true });
  //       this.showDegreeError.set(true);
  //     }
  //   }
  // }

  // // Form control getters
  // get placementCellNameControl(): FormControl | null {
  //   return this.formReady()
  //     ? (this.profileForm.get('placementCellName') as FormControl)
  //     : null;
  // }

  // get placementCellEmailControl(): FormControl | null {
  //   return this.formReady()
  //     ? (this.profileForm.get('placementCellEmail') as FormControl)
  //     : null;
  // }

  // get websiteControl(): FormControl | null {
  //   return this.formReady()
  //     ? (this.profileForm.get('website') as FormControl)
  //     : null;
  // }

  // get branchNameControl(): FormControl | null {
  //   return this.formReady()
  //     ? (this.profileForm.get('branchName') as FormControl)
  //     : null;
  // }

  // get domainInputControl(): FormControl | null {
  //   return this.formReady()
  //     ? (this.profileForm.get('domainInput') as FormControl)
  //     : null;
  // }

  // get domainsControl(): FormControl | null {
  //   return this.formReady()
  //     ? (this.profileForm.get('domains') as FormControl)
  //     : null;
  // }

  // get degreesControl(): FormControl | null {
  //   return this.formReady()
  //     ? (this.profileForm.get('degrees') as FormControl)
  //     : null;
  // }
}
