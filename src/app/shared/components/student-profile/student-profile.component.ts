import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentProfileService } from '../../../features/student/services/student-profile.service';
import { ToastService } from '../../services/toast.service';
import {
  StudentProfile,
  StudentProfilePlacementCellUpdatePayload,
  StudentProfileUpdatePayload,
} from '../../../features/student/models/student.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { SharedInputComponent } from '../shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';
import {
  DropdownAutocompleteComponentComponent,
  SelectOption,
} from '../dropdown-autocomplete-component/dropdown-autocomplete-component.component';
import { defaultValidationMessages } from '../../../shared/types/validation.types';
import { PlacementCellProfileService } from '../../../features/placement-cell/services/placement-cell-profile.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedInputComponent,
    ValidationErrorsComponent,
    DropdownAutocompleteComponentComponent,
  ],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
})
export class StudentProfileComponent implements OnInit, OnChanges {
  @Input() studentId!: string;
  @Input() isPlacementCellView: boolean = false;

  private fb = inject(FormBuilder);
  private studentService = inject(StudentProfileService);
  private toastService = inject(ToastService);
  private placementCellService = inject(PlacementCellProfileService);

  profileForm!: FormGroup;
  validationMessages = defaultValidationMessages;
  isInitialized = signal(false);
  isLoading = signal(true);
  loadError = signal<string | null>(null);

  studentProfile = this.studentService.studentProfile$;
  isEditMode = this.studentService.isEditMode$;

  // Local state
  currentEditMode = signal(false);
  currentStudentProfile = signal<StudentProfile | null>(null);
  availableDegrees = signal<SelectOption<string>[]>([]);

  // Placement status options
  placementStatusOptions = signal([
    { label: 'Not Placed', value: 'not_placed' },
    { label: 'Placed', value: 'placed' },
  ]);

  // Computed value for field editability
  canEditField = computed(() => {
    const editMode = this.currentEditMode();
    const isVerified =
      this.currentStudentProfile()?.isVerifiedByPlacementCell || false;

    if (!editMode) {
      // All fields are non-editable if not in edit mode
      return {
        fullName: false,
        cgpa: false,
        bachelorsGpa: false,
        tenthPercentage: false,
        twelfthPercentage: false,
        diplomaPercentage: false,
        backlogs: false,
        liveBacklogs: false,
        enrollmentNumber: false,
        placementStatus: false,
        isVerifiedByPlacementCell: false,
        degree: false,
        placement_cell: false,
      };
    }

    if (this.isPlacementCellView) {
      // Placement cell can edit all fields
      return {
        fullName: true,
        cgpa: true,
        bachelorsGpa: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        diplomaPercentage: true,
        backlogs: true,
        liveBacklogs: true,
        enrollmentNumber: true,
        placementStatus: true,
        isVerifiedByPlacementCell: true,
        degree: true,
        placement_cell: false,
      };
    } else if (isVerified) {
      // Verified students can only update no fields
      return {
        fullName: false,
        cgpa: false,
        bachelorsGpa: false,
        tenthPercentage: false,
        twelfthPercentage: false,
        diplomaPercentage: false,
        backlogs: false,
        liveBacklogs: false,
        enrollmentNumber: false,
        placementStatus: false,
        isVerifiedByPlacementCell: false,
        degree: false,
        placement_cell: false,
      };
    } else {
      // Unverified students can update basic fields
      return {
        fullName: true,
        cgpa: true,
        bachelorsGpa: true,
        tenthPercentage: true,
        twelfthPercentage: true,
        diplomaPercentage: true,
        backlogs: true,
        liveBacklogs: true,
        enrollmentNumber: false,
        placementStatus: false,
        isVerifiedByPlacementCell: false,
        degree: false,
        placement_cell: false,
      };
    }
  });

  ngOnInit(): void {
    console.log('StudentProfile: Initializing with studentId:', this.studentId);

    // Set the placement cell view status in the service
    this.studentService.setPlacementCellView(this.isPlacementCellView);

    // Initialize the form
    this.initializeForm();

    // Only load profile if ID is provided during initialization
    if (this.studentId) {
      console.log('StudentProfile: StudentId present, loading profile');
      this.isInitialized.set(true);
      this.loadProfile();
    } else {
      console.warn(
        'StudentProfile: No studentId provided, skipping profile load'
      );
      this.isLoading.set(false);
    }

    // Subscribe to profile changes to update form
    this.studentProfile.subscribe((profile) => {
      if (profile) {
        console.log('StudentProfile: Profile data received:', profile.fullName);
        this.updateFormValues(profile);
        this.currentStudentProfile.set(profile);
        this.isLoading.set(false);
        this.loadError.set(null);
      }
    });

    // Subscribe to edit mode changes to handle form state
    this.isEditMode.subscribe((isEdit) => {
      // Update our local signal with the value from the Observable
      this.currentEditMode.set(isEdit);

      if (isEdit) {
        // If we're in edit mode and it's a placement cell view, load degrees
        if (this.isPlacementCellView) {
          this.loadPlacementCellDegrees();
        }
        this.enableFormControls();
      } else {
        this.disableFormControls();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('StudentProfile: Changes detected:', changes);

    // If studentId changes and is now defined, and we haven't initialized yet
    if (
      changes['studentId'] &&
      changes['studentId'].currentValue &&
      !this.isInitialized()
    ) {
      console.log('StudentProfile: Loading profile due to studentId change');
      this.isInitialized.set(true);
      this.isLoading.set(true);
      this.loadProfile();
    }

    // Handle changes to isPlacementCellView
    if (changes['isPlacementCellView']) {
      this.studentService.setPlacementCellView(this.isPlacementCellView);
    }
  }

  private loadPlacementCellDegrees(): void {
    // Get the placement cell ID from the student profile
    const profile = this.currentStudentProfile();
    if (!profile || !profile.placement_cell) {
      console.warn(
        'Cannot load degrees: placement cell information is missing'
      );
      return;
    }

    const placementCellId = profile.placement_cell.placementCellId;

    if (placementCellId && this.availableDegrees().length === 0) {
      this.placementCellService.getProfile(placementCellId).subscribe({
        next: (placementCell) => {
          if (placementCell && placementCell.placementCellDegrees) {
            this.availableDegrees.set(
              placementCell.placementCellDegrees.map((d) => ({
                label: d.degree.name,
                value: d.degree.degreeId,
              }))
            );
          }
        },
        error: (error) => {
          this.toastService.show(
            'Failed to load placement cell degrees: ' + error.message,
            'error'
          );
        },
      });
    }
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      // Basic student fields
      fullName: ['', [Validators.required, Validators.maxLength(255)]],
      cgpa: [null, [Validators.min(0), Validators.max(10)]],
      bachelorsGpa: [null, [Validators.min(0), Validators.max(10)]],
      tenthPercentage: [null, [Validators.min(0), Validators.max(100)]],
      twelfthPercentage: [null, [Validators.min(0), Validators.max(100)]],
      diplomaPercentage: [null, [Validators.min(0), Validators.max(100)]],
      backlogs: [null, [Validators.min(0)]],
      liveBacklogs: [null, [Validators.min(0)]],

      // Additional fields for placement cell
      enrollmentNumber: ['', [Validators.required, Validators.maxLength(50)]],
      placementStatus: ['not_placed'],
      isVerifiedByPlacementCell: [false],
      degreeId: [''],

      // Non-editable, informational fields
      degreeName: [{ value: '', disabled: true }],
      placementCellId: [{ value: '', disabled: true }],
      placementCellName: [{ value: '', disabled: true }],
    });

    // Add value change listeners to convert string inputs to numbers
    this.numericFields.forEach((field) => {
      const control = this.profileForm.get(field);
      if (control) {
        control.valueChanges.subscribe((value) => {
          if (value === '' || value === null) {
            control.setValue(null, { emitEvent: false });
          } else {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
              control.setValue(numValue, { emitEvent: false });
            }
          }
        });
      }
    });

    // Initially disable the form
    this.disableFormControls();
  }

  private loadProfile(): void {
    console.log('StudentProfile: Loading profile for ID:', this.studentId);
    if (!this.studentId) {
      console.error('StudentProfile: Cannot load profile without studentId');
      this.isLoading.set(false);
      this.loadError.set('No student ID provided');
      return;
    }

    this.isLoading.set(true);
    this.loadError.set(null);

    this.studentService.getStudentProfile(this.studentId).subscribe({
      next: (profile) => {
        console.log('StudentProfile: Successfully loaded profile');
        // The profile is already set in the service, the subscription
        // in ngOnInit will handle updating the form
      },
      error: (error) => {
        console.error('StudentProfile: Error loading profile:', error);
        this.isLoading.set(false);
        this.loadError.set(error.message || 'Failed to load profile');
        this.toastService.show(
          'Failed to load student profile: ' + error.message,
          'error'
        );
      },
    });
  }

  private updateFormValues(profile: StudentProfile): void {
    if (!profile) return;

    this.profileForm.patchValue({
      // Core student fields
      fullName: profile.fullName,
      cgpa: profile.cgpa,
      bachelorsGpa: profile.bachelorsGpa,
      tenthPercentage: profile.tenthPercentage,
      twelfthPercentage: profile.twelfthPercentage,
      diplomaPercentage: profile.diplomaPercentage,
      backlogs: profile.backlogs,
      liveBacklogs: profile.liveBacklogs,

      // Placement cell specific
      enrollmentNumber: profile.enrollmentNumber,
      placementStatus: profile.placementStatus,
      isVerifiedByPlacementCell: profile.isVerifiedByPlacementCell,

      // Add null checks for degree and placement_cell
      degreeId: profile.degree?.degreeId || '',
      degreeName: profile.degree?.name || '',
      placementCellId: profile.placement_cell?.placementCellId || '',
      placementCellName: profile.placement_cell?.placementCellName || '',
    });
  }

  private enableFormControls(): void {
    // Enable core student fields
    this.profileForm.get('fullName')?.enable();
    this.profileForm.get('cgpa')?.enable();
    this.profileForm.get('bachelorsGpa')?.enable();
    this.profileForm.get('tenthPercentage')?.enable();
    this.profileForm.get('twelfthPercentage')?.enable();
    this.profileForm.get('diplomaPercentage')?.enable();
    this.profileForm.get('backlogs')?.enable();
    this.profileForm.get('liveBacklogs')?.enable();

    // Enable placement cell specific fields if in placement cell view
    if (this.isPlacementCellView) {
      this.profileForm.get('enrollmentNumber')?.enable();
      this.profileForm.get('placementStatus')?.enable();
      this.profileForm.get('isVerifiedByPlacementCell')?.enable();
    }
  }

  private disableFormControls(): void {
    // Disable all controls
    Object.keys(this.profileForm.controls).forEach((key) => {
      this.profileForm.get(key)?.disable();
    });
  }

  onEdit(): void {
    this.studentService.setEditMode(true);
  }

  onCancel(): void {
    // Add safety check before resetting
    if (this.currentStudentProfile()) {
      this.studentService.resetProfile();
      this.toastService.show('Edit cancelled', 'info');
    } else {
      // If no profile exists, just exit edit mode without reset
      this.studentService.setEditMode(false);
      this.toastService.show('Edit cancelled', 'info');
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach((key) => {
        const control = this.profileForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formValues = this.profileForm.getRawValue();

    // Convert numeric fields to numbers
    this.numericFields.forEach((field) => {
      if (formValues[field] !== null && formValues[field] !== undefined) {
        formValues[field] = Number(formValues[field]);
      }
    });

    let updatePayload: any;

    if (this.isPlacementCellView) {
      // Placement cell can update all fields
      updatePayload = {
        fullName: formValues.fullName,
        cgpa: formValues.cgpa,
        bachelorsGpa: formValues.bachelorsGpa,
        tenthPercentage: formValues.tenthPercentage,
        backlogs: formValues.backlogs,
        liveBacklogs: formValues.liveBacklogs,
        enrollmentNumber: formValues.enrollmentNumber,
        placementStatus: formValues.placementStatus,
        isVerifiedByPlacementCell: formValues.isVerifiedByPlacementCell,
      };

      // Only include degreeId if it was changed
      if (this.profileForm.get('degreeId')?.dirty) {
        updatePayload.degreeId = formValues.degreeId;
      }
      if (this.profileForm.get('tenthPercentage')?.dirty && formValues.twelfthPercentage) {
        updatePayload.twelfthPercentage = formValues.twelfthPercentage
      }
      if (this.profileForm.get('diplomaPercentage')?.dirty && formValues.diplomaPercentage) {
        updatePayload.diplomaPercentage = formValues.diplomaPercentage
      }
    } else if (this.currentStudentProfile()?.isVerifiedByPlacementCell) {
      // Verified students can't update any fields
      this.toastService.show(
        'Your profile is verified. You cannot make changes at this time.',
        'warning'
      );
      this.studentService.setEditMode(false);
      return;
    } else {
      // Unverified students can update basic fields
      updatePayload = {
        fullName: formValues.fullName,
        cgpa: formValues.cgpa,
        bachelorsGpa: formValues.bachelorsGpa,
        tenthPercentage: formValues.tenthPercentage,
        twelfthPercentage: formValues.twelfthPercentage,
        diplomaPercentage: formValues.diplomaPercentage,
        backlogs: formValues.backlogs,
        liveBacklogs: formValues.liveBacklogs,
      };
    }

    console.log('Submitting update with payload:', updatePayload);

    this.studentService
      .updateStudentProfile(this.studentId, updatePayload)
      .subscribe({
        next: (updatedProfile) => {
          this.toastService.show('Profile updated successfully', 'success');

          // First, exit edit mode
          this.studentService.setEditMode(false);

          // Then reload the profile data to ensure we have fresh data
          setTimeout(() => {
            this.loadProfile();
          }, 500);
        },
        error: (error) => {
          this.toastService.show(
            'Failed to update profile: ' + error.message,
            'error'
          );
        },
      });
  }

  onPlacementStatusChange(status: string): void {
    this.profileForm.get('placementStatus')?.setValue(status);
  }

  // Form control getters
  get fullNameControl(): FormControl {
    return this.profileForm.get('fullName') as FormControl;
  }

  get cgpaControl(): FormControl {
    return this.profileForm.get('cgpa') as FormControl;
  }

  get bachelorsGpaControl(): FormControl {
    return this.profileForm.get('bachelorsGpa') as FormControl;
  }

  get tenthPercentageControl(): FormControl {
    return this.profileForm.get('tenthPercentage') as FormControl;
  }

  get twelfthPercentageControl(): FormControl {
    return this.profileForm.get('twelfthPercentage') as FormControl;
  }

  get diplomaPercentageControl(): FormControl {
    return this.profileForm.get('diplomaPercentage') as FormControl;
  }

  get backlogsControl(): FormControl {
    return this.profileForm.get('backlogs') as FormControl;
  }

  get liveBacklogsControl(): FormControl {
    return this.profileForm.get('liveBacklogs') as FormControl;
  }

  get enrollmentNumberControl(): FormControl {
    return this.profileForm.get('enrollmentNumber') as FormControl;
  }

  get placementStatusControl(): FormControl {
    return this.profileForm.get('placementStatus') as FormControl;
  }

  get isVerifiedByPlacementCellControl(): FormControl {
    return this.profileForm.get('isVerifiedByPlacementCell') as FormControl;
  }

  get degreeIdControl(): FormControl {
    return this.profileForm.get('degreeId') as FormControl;
  }

  // List of numeric fields
  private numericFields = [
    'cgpa',
    'bachelorsGpa',
    'tenthPercentage',
    'twelfthPercentage',
    'diplomaPercentage',
    'backlogs',
    'liveBacklogs',
  ];

  onDegreeSelected(degreeId: string): void {
    if (this.currentStudentProfile()?.degree?.degreeId !== degreeId) {
      this.profileForm.get('degreeId')?.setValue(degreeId);
      this.profileForm.get('degreeId')?.markAsDirty();
      this.profileForm.get('degreeId')?.markAsTouched();
    }
  }
}
