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
import { PlacementCellProfileService } from '../../services/placement-cell-profile.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { SharedInputComponent } from '../../../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../../../shared/components/validation-errors/validation-errors.component';
import {
  DropdownAutocompleteComponentComponent,
  SelectOption,
} from '../../../../shared/components/dropdown-autocomplete-component/dropdown-autocomplete-component.component';
import {
  DomainItem,
  PlacementCellProfile,
} from '../../models/placement-cell.model';

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
  templateUrl: './placement-cell-profile.component.html',
  styleUrls: ['./placement-cell-profile.component.css'],
})
export class PlacementCellProfileComponent implements OnInit {
  @Input() placementCellId!: string;

  private fb = inject(FormBuilder);
  private profileService = inject(PlacementCellProfileService);
  private toastService = inject(ToastService);

  profileForm!: FormGroup;

  profile$ = this.profileService.profile$;
  isEditMode$ = this.profileService.isEditMode$;

  // Local state
  currentEditMode = signal(false);
  domains = signal<string[]>([]);
  degreeNames = signal<SelectOption<string>[]>([]);

  // Computed value for field editability
  canEditField = computed(() => {
    const editMode = this.currentEditMode();

    return {
      placementCellName: editMode,
      placementCellEmail: editMode,
      website: editMode,
      domains: editMode,

      // Fields that can't be edited in profile
      branchName: false,
      degreeNames: false,
    };
  });

  ngOnInit(): void {
    // Initialize the form
    this.initializeForm();

    // Load placement cell profile
    this.loadProfile();

    // Subscribe to profile changes to update form
    this.profile$.subscribe((profile) => {
      if (profile) {
        this.updateFormValues(profile);

        // Extract domains for display
        if (
          profile.placementCellDomains &&
          profile.placementCellDomains.length > 0
        ) {
          this.domains.set(profile.placementCellDomains.map((d) => d.domain));
        }

        // Extract degree names for display
        if (
          profile.placementCellDegrees &&
          profile.placementCellDegrees.length > 0
        ) {
          this.degreeNames.set(
            profile.placementCellDegrees.map((d) => ({
              label: d.degree.name,
              value: d.degree.degreeId,
            }))
          );
        }
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
      placementCellName: [{ value: '', disabled: true }],
      placementCellEmail: ['', [Validators.required, Validators.email]],
      website: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(https?:\\/\\/)([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?$'
          ),
        ],
      ],
      domainInput: [''], // For domain input field

      // Read-only fields
      branchName: [{ value: '', disabled: true }],
    });

    // Initially disable the form
    this.disableFormControls();
  }

  private loadProfile(): void {
    this.profileService.getProfile(this.placementCellId).subscribe({
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

  private updateFormValues(profile: PlacementCellProfile): void {
    this.profileForm.patchValue({
      placementCellName: profile.placementCellName || '',
      placementCellEmail: profile.placementCellEmail,
      website: profile.website,
      branchName: profile.branch.name,
    });
  }

  private enableFormControls(): void {
    // Enable editable fields
    this.profileForm.get('placementCellEmail')?.enable();
    this.profileForm.get('website')?.enable();
    this.profileForm.get('domainInput')?.enable();
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
      placementCellEmail: formValues.placementCellEmail,
      website: formValues.website,
    };

    this.profileService
      .updateProfile(this.placementCellId, updatePayload)
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

  // Domain management methods
  onDomainAdd(): void {
    let domainInputValue = this.domainInputControl.value?.trim();
    const currentDomains = [...this.domains()];

    // Ensure @ is prefixed
    if (domainInputValue && !domainInputValue.startsWith('@')) {
      domainInputValue = '@' + domainInputValue;
    }

    if (domainInputValue && !currentDomains.includes(domainInputValue)) {
      const updatedDomains = [...currentDomains, domainInputValue];
      this.domains.set(updatedDomains);
      this.domainInputControl.setValue('');
    }
  }

  onRemoveDomain(domain: string): void {
    const currentDomains = this.domains();
    const updatedDomains = currentDomains.filter((d) => d !== domain);
    this.domains.set(updatedDomains);
  }

  // Form control getters
  get placementCellNameControl(): FormControl {
    return this.profileForm.get('placementCellName') as FormControl;
  }

  get placementCellEmailControl(): FormControl {
    return this.profileForm.get('placementCellEmail') as FormControl;
  }

  get websiteControl(): FormControl {
    return this.profileForm.get('website') as FormControl;
  }

  get branchNameControl(): FormControl {
    return this.profileForm.get('branchName') as FormControl;
  }

  get domainInputControl(): FormControl {
    return this.profileForm.get('domainInput') as FormControl;
  }
}
