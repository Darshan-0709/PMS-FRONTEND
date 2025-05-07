import {
  Component,
  Input,
  OnInit,
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
import { DropdownAutocompleteComponentComponent } from '../dropdown-autocomplete-component/dropdown-autocomplete-component.component';

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
export class StudentProfileComponent implements OnInit {
  @Input() studentId!: string;
  @Input() isPlacementCellView: boolean = false;

  private fb = inject(FormBuilder);
  private studentService = inject(StudentProfileService);
  private toastService = inject(ToastService);

  profileForm!: FormGroup;

  studentProfile = this.studentService.studentProfile$;
  isEditMode = this.studentService.isEditMode$;

  // Local state for isEditMode
  currentEditMode = signal(false);

  // Placement status options
  placementStatusOptions = signal([
    { label: 'Not Placed', value: 'not_placed' },
    { label: 'Placed', value: 'placed' },
    { label: 'Offered', value: 'offered' },
  ]);

  // Computed value for field editability
  canEditField = computed(() => {
    // Use the signal value instead of calling the Observable
    const editMode = this.currentEditMode();

    return {
      // Basic student info - always editable by both students and placement cells
      fullName: editMode,
      cgpa: editMode,
      bachelorsGpa: editMode,
      tenthPercentage: editMode,
      twelfthPercentage: editMode,
      diplomaPercentage: editMode,
      backlogs: editMode,
      liveBacklogs: editMode,
      resumeUrl: editMode,

      // Fields that only placement cells can edit
      enrollmentNumber: editMode && this.isPlacementCellView,
      placementStatus: editMode && this.isPlacementCellView,
      isVerifiedByPlacementCell: editMode && this.isPlacementCellView,

      // Fields that can't be edited by anyone
      degree: false,
      placement_cell: false,
    };
  });

  ngOnInit(): void {
    // Set the placement cell view status in the service
    this.studentService.setPlacementCellView(this.isPlacementCellView);

    // Initialize the form
    this.initializeForm();

    // Load student profile
    this.loadProfile();

    // Subscribe to profile changes to update form
    this.studentProfile.subscribe((profile) => {
      if (profile) {
        this.updateFormValues(profile);
      }
    });

    // Subscribe to edit mode changes to handle form state
    this.isEditMode.subscribe((isEdit) => {
      // Update our local signal with the value from the Observable
      this.currentEditMode.set(isEdit);

      if (isEdit) {
        this.enableFormControls();
      } else {
        this.disableFormControls();
      }
    });
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      // Basic student info
      fullName: ['', Validators.required],
      cgpa: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
      bachelorsGpa: ['', [Validators.min(0), Validators.max(10)]],
      tenthPercentage: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      twelfthPercentage: ['', [Validators.min(0), Validators.max(100)]],
      diplomaPercentage: ['', [Validators.min(0), Validators.max(100)]],
      backlogs: [0, [Validators.required, Validators.min(0)]],
      liveBacklogs: [0, [Validators.required, Validators.min(0)]],
      resumeUrl: [''],

      // Placement cell specific fields
      enrollmentNumber: [{ value: '', disabled: true }, Validators.required],
      placementStatus: [{ value: 'not_placed', disabled: true }],
      isVerifiedByPlacementCell: [{ value: false, disabled: true }],

      // Non-editable fields
      degreeId: [{ value: '', disabled: true }],
      degreeName: [{ value: '', disabled: true }],
      placementCellId: [{ value: '', disabled: true }],
      placementCellName: [{ value: '', disabled: true }],
    });

    // Initially disable the form
    this.disableFormControls();
  }

  private loadProfile(): void {
    this.studentService.getStudentProfile(this.studentId).subscribe({
      next: (profile) => {
        // Success handling is done in the service via tap operator
        this.toastService.show('Profile loaded successfully', 'success');
      },
      error: (error) => {
        this.toastService.show(
          'Failed to load profile: ' + error.message,
          'error'
        );
      },
    });
  }

  private updateFormValues(profile: StudentProfile): void {
    this.profileForm.patchValue({
      // Basic info
      fullName: profile.fullName,
      cgpa: profile.cgpa,
      bachelorsGpa: profile.bachelorsGpa,
      tenthPercentage: profile.tenthPercentage,
      twelfthPercentage: profile.twelfthPercentage,
      diplomaPercentage: profile.diplomaPercentage,
      backlogs: profile.backlogs,
      liveBacklogs: profile.liveBacklogs,
      resumeUrl: profile.resumeUrl,

      // Placement cell specific
      enrollmentNumber: profile.enrollmentNumber,
      placementStatus: profile.placementStatus,
      isVerifiedByPlacementCell: profile.isVerifiedByPlacementCell,

      // Non-editable
      degreeId: profile.degree.degreeId,
      degreeName: profile.degree.name,
      placementCellId: profile.placement_cell.placementCellId,
      placementCellName: profile.placement_cell.placementCellName,
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
    this.profileForm.get('resumeUrl')?.enable();

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
    this.studentService.resetProfile();
    this.toastService.show('Edit cancelled', 'info');
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.toastService.show(
        'Please fill all required fields correctly',
        'error'
      );
      return;
    }

    const formValues = this.profileForm.getRawValue();

    let updatePayload:
      | StudentProfileUpdatePayload
      | StudentProfilePlacementCellUpdatePayload;

    if (this.isPlacementCellView) {
      // Placement cell update with additional fields
      updatePayload = {
        fullName: formValues.fullName,
        cgpa: formValues.cgpa,
        bachelorsGpa: formValues.bachelorsGpa,
        tenthPercentage: formValues.tenthPercentage,
        twelfthPercentage: formValues.twelfthPercentage,
        diplomaPercentage: formValues.diplomaPercentage,
        backlogs: formValues.backlogs,
        liveBacklogs: formValues.liveBacklogs,
        resumeUrl: formValues.resumeUrl,

        // Placement cell specific fields
        enrollmentNumber: formValues.enrollmentNumber,
        placementStatus: formValues.placementStatus,
        isVerifiedByPlacementCell: formValues.isVerifiedByPlacementCell,
      };
    } else {
      // Student update with limited fields
      updatePayload = {
        fullName: formValues.fullName,
        cgpa: formValues.cgpa,
        bachelorsGpa: formValues.bachelorsGpa,
        tenthPercentage: formValues.tenthPercentage,
        twelfthPercentage: formValues.twelfthPercentage,
        diplomaPercentage: formValues.diplomaPercentage,
        backlogs: formValues.backlogs,
        liveBacklogs: formValues.liveBacklogs,
        resumeUrl: formValues.resumeUrl,
      };
    }

    this.studentService
      .updateStudentProfile(this.studentId, updatePayload)
      .subscribe({
        next: () => {
          this.toastService.show('Profile updated successfully', 'success');
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

  get resumeUrlControl(): FormControl {
    return this.profileForm.get('resumeUrl') as FormControl;
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
}
