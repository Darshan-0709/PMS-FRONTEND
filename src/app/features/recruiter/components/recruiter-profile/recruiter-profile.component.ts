import {
  Component,
  Input,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { RecruiterProfileService } from '../../services/recruiter-profile.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { SharedInputComponent } from '../../../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../../../shared/components/validation-errors/validation-errors.component';
import { RecruiterProfile } from '../../models/recruiter.model';

@Component({
  selector: 'app-recruiter-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedInputComponent,
    ValidationErrorsComponent,
  ],
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.css'],
})
export class RecruiterProfileComponent implements OnInit {
  @Input() recruiterId!: string;

  private fb = inject(FormBuilder);
  private profileService = inject(RecruiterProfileService);
  private toastService = inject(ToastService);

  profileForm!: FormGroup;

  profile$ = this.profileService.profile$;
  isEditMode$ = this.profileService.isEditMode$;

  // Local state for edit mode
  currentEditMode = signal(false);

  // Computed value for field editability
  canEditField = computed(() => {
    const editMode = this.currentEditMode();

    return {
      companyName: editMode,
      representativePosition: editMode,
      description: editMode,
      website: editMode,
      companyEmail: editMode,
    };
  });

  ngOnInit(): void {
    // Initialize the form
    this.initializeForm();

    // Load recruiter profile
    this.loadProfile();

    // Subscribe to profile changes to update form
    this.profile$.subscribe((profile) => {
      if (profile) {
        this.updateFormValues(profile);
      }
    });

    // Subscribe to edit mode changes to handle form state
    this.isEditMode$.subscribe((isEdit) => {
      // Update local signal with Observable value
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
      companyName: ['', Validators.required],
      representativePosition: ['', Validators.required],
      description: [''],
      website: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(https?:\\/\\/)([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?$'
          ),
        ],
      ],
      companyEmail: ['', [Validators.required, Validators.email]],
    });

    // Initially disable the form
    this.disableFormControls();
  }

  private loadProfile(): void {
    this.profileService.getProfile(this.recruiterId).subscribe({
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

  private updateFormValues(profile: RecruiterProfile): void {
    this.profileForm.patchValue({
      companyName: profile.companyName,
      representativePosition: profile.representativePosition,
      description: profile.description,
      website: profile.website,
      companyEmail: profile.companyEmail,
    });
  }

  private enableFormControls(): void {
    // Enable all form controls
    Object.keys(this.profileForm.controls).forEach((key) => {
      this.profileForm.get(key)?.enable();
    });
  }

  private disableFormControls(): void {
    // Disable all controls
    Object.keys(this.profileForm.controls).forEach((key) => {
      this.profileForm.get(key)?.disable();
    });
  }

  onEdit(): void {
    this.profileService.setEditMode(true);
  }

  onCancel(): void {
    this.profileService.resetProfile();
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

    const updatePayload = {
      companyName: formValues.companyName,
      representativePosition: formValues.representativePosition,
      description: formValues.description,
      website: formValues.website,
      companyEmail: formValues.companyEmail,
    };

    this.profileService
      .updateProfile(this.recruiterId, updatePayload)
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

  // Form control getters
  get companyNameControl(): FormControl {
    return this.profileForm.get('companyName') as FormControl;
  }

  get representativePositionControl(): FormControl {
    return this.profileForm.get('representativePosition') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.profileForm.get('description') as FormControl;
  }

  get websiteControl(): FormControl {
    return this.profileForm.get('website') as FormControl;
  }

  get companyEmailControl(): FormControl {
    return this.profileForm.get('companyEmail') as FormControl;
  }
}
