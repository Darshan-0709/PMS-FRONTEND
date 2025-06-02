import { Component, effect, inject, OnInit, signal } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, tap, throwError } from 'rxjs';
import { SharedInputComponent } from '../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../shared/components/validation-errors/validation-errors.component';
import { DropdownAutocompleteComponentComponent } from '../../shared/components/dropdown-autocomplete/dropdown-autocomplete.component';
import { defaultValidationMessages } from '../../types/validation.types';
import { SelectOption } from '../../types/common.types';
import { RegisterService } from '../../services/register.service';
import { PlacementCellProfileData } from '../../types/auth.types';

@Component({
  selector: 'app-placement-cell-form',
  templateUrl: './placement-cell-form.component.html',
  styleUrls: ['./placement-cell-form.component.css'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  imports: [
    SharedInputComponent,
    ValidationErrorsComponent,
    DropdownAutocompleteComponentComponent,
    ReactiveFormsModule,
  ],
})
export class PlacementCellFormComponent implements OnInit {
  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  validationMessages = defaultValidationMessages;
  registerService = inject(RegisterService);
  registrationSuccess = signal<{ message: string } | null>(null);

  // Signals for data management
  branches = signal<SelectOption<string>[]>([]);
  degrees = signal<SelectOption<string>[]>([]);

  constructor() {
    effect(() => {
      const branches = this.registerService.branches();
      if (branches && branches.length > 0) {
        this.branches.set(
          branches.map(branch => ({
            label: branch.name,
            value: branch.name,
          }))
        );
      }
    });

    // React to placement cells signal changes
    effect(() => {
      const degrees = this.registerService.degrees();
      if (degrees && degrees.length > 0) {
        this.degrees.set(
          degrees.map(degree => ({
            label: degree.name,
            value: degree.degreeId,
          }))
        );
      }
    });
  }

  ngOnInit(): void {
    // Fetch data from the service
    const placementCellForm = new FormGroup({
      placementCellName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      domainInput: new FormControl(''),
      domains: new FormControl<string[]>([], [Validators.required]),
      // Array of domains
      branchId: new FormControl('', [Validators.required]),
      degrees: new FormControl<string[]>([], Validators.required),
      placementCellEmail: new FormControl('', [Validators.required, Validators.email]),
      website: new FormControl('', [
        Validators.required,
        Validators.pattern(/^https?:\/\/[^\s$.?#].[^\s]*$/),
      ]),
    });

    this.parentFormGroup.addControl('placementCellForm', placementCellForm);
    const savedData = this.registerService.placementCellProfile();
    placementCellForm.valueChanges.subscribe(val => {
      if (
        val.branchId !== undefined &&
        val.degrees !== undefined &&
        val.domains !== undefined &&
        val.placementCellEmail !== undefined &&
        val.placementCellName !== undefined &&
        val.website !== undefined
      ) {
        this.registerService.setPlacementCellProfile(val as PlacementCellProfileData);
      }
    });
    if (savedData) {
      placementCellForm.patchValue(savedData);
    }
  }
  ngOnDestroy() {
    this.parentFormGroup.removeControl('placementCellForm');
  }
  onDomainAdd() {
    let domainInputValue = this.domainInputControl.value?.trim();
    const currentDomains = this.domainsControl.value || [];

    // Ensure @ is prefixed
    if (domainInputValue && !domainInputValue.startsWith('@')) {
      domainInputValue = '@' + domainInputValue;
    }

    if (domainInputValue && !currentDomains.includes(domainInputValue)) {
      const updatedDomains = [...currentDomains, domainInputValue];
      this.domainsControl.setValue(updatedDomains);
      this.domainsControl.markAsDirty();
      this.domainsControl.markAsTouched();
      this.domainInputControl.setValue('');
    }
  }

  onRemoveDomain(domain: string) {
    const currentDomains = this.domainsControl.value || [];
    const updatedDomains = currentDomains.filter((d: string) => d !== domain);

    this.domainsControl.setValue(updatedDomains);
    this.domainsControl.markAsDirty();
    this.domainsControl.markAsTouched();
  }

  onAddDegree(degreeId: string) {
    const currentDegrees = this.degreeControl.value || [];

    // Add the new degreeId to the array if it doesn't already exist
    if (!currentDegrees.includes(degreeId)) {
      const updatedDegrees = [...currentDegrees, degreeId];
      this.degreeControl.setValue(updatedDegrees);
      this.degreeControl.markAsDirty();
      this.degreeControl.markAsTouched();
    }
  }

  onDegreeSelected() {
    this.degreeControl.markAsDirty();
    this.degreeControl.markAsTouched();
  }

  onRemoveDegree(degreeId: string) {
    // Get the current value of the degreeNames form control
    const currentDegrees = this.degreeControl.value || [];

    // Filter out the degree to be removed
    const updatedDegrees = currentDegrees.filter((degree: string) => degree !== degreeId);

    // Update the form control with the new array
    this.degreeControl.setValue(updatedDegrees);
    this.degreeControl.markAsDirty();
    this.degreeControl.markAsTouched();
  }

  onBranchSelected(branchName: string) {
    this.branchIdControl.setValue(branchName);
    this.branchIdControl.markAsDirty();
    this.branchIdControl.markAsTouched();
  }

  onSubmit() {
    if (this.placementCellForm.invalid) {
      this.placementCellForm.markAllAsTouched();
      return;
    }

    const formData = this.placementCellForm.getRawValue();
    this.registerService.setPlacementCellProfile(formData);

    this.registerService
      .submitRegistration()
      .pipe(
        tap(response => {
          if (response.success) {
            this.registrationSuccess.set({ message: response.message });
          }
        }),
        catchError(err => {
          Object.entries(err).forEach(([key, message]) => {
            const control = this.placementCellForm.get(key);
            if (control) {
              control.setErrors({ server: message });
              control.markAsTouched();
              control.markAsDirty();
            }
          });
          return throwError(() => err);
        })
      )
      .subscribe();
  }

  get placementCellForm() {
    return this.parentFormGroup.get('placementCellForm') as FormGroup;
  }

  get placementCellNameControl(): FormControl {
    return this.placementCellForm.get('placementCellName') as FormControl;
  }
  // input
  get domainInputControl(): FormControl {
    return this.placementCellForm.get('domainInput') as FormControl;
  }
  // array
  get domainsControl(): FormControl {
    return this.placementCellForm.get('domains') as FormControl;
  }

  get branchIdControl(): FormControl {
    return this.placementCellForm.get('branchId') as FormControl;
  }

  get degreeControl(): FormControl {
    return this.placementCellForm.get('degrees') as FormControl;
  }

  get placementCellEmailControl(): FormControl {
    return this.placementCellForm.get('placementCellEmail') as FormControl;
  }

  get websiteControl(): FormControl {
    return this.placementCellForm.get('website') as FormControl;
  }
}
