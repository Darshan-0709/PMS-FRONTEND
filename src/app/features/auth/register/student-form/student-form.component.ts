import {
  Component,
  effect,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { StudentProfileFormModel } from '../register.models';
import { SharedInputComponent } from '../../../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../../../shared/components/validation-errors/validation-errors.component';
import { DropdownAutocompleteComponentComponent, SelectOption } from '../../../../shared/components/dropdown-autocomplete-component/dropdown-autocomplete-component.component';
import { AlertModalComponent } from '../../../../shared/components/alert-modal/alert-modal.component';
import { defaultValidationMessages } from '../../../../shared/types/validation.types';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
  imports: [
    SharedInputComponent,
    ValidationErrorsComponent,
    DropdownAutocompleteComponentComponent,
    ReactiveFormsModule,
    AlertModalComponent,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class StudentFormComponent implements OnInit {
  parentContainer = inject(ControlContainer);

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  validationMessages = defaultValidationMessages;
  registerService = inject(RegisterService);
  registrationSuccess = output<{ message: string }>();

  // Signals for data management
  placementCells = this.registerService.placementCells;
  placementCellAutoCompleteList = signal<SelectOption<string>[]>([]);
  degrees = signal<SelectOption<string>[]>([]);

  domainMismatchWarning = signal<boolean>(false);

  constructor() {
    effect(() => {
      const cells = this.placementCells();
      if (cells && cells.length > 0) {
        this.placementCellAutoCompleteList.set(
          cells.map((cell) => ({
            label: cell.placementCellName,
            value: cell.placementCellId,
          }))
        );
      }
    });
  }

  ngOnInit(): void {
    // Initialize the studentForm
    const studentForm = new FormGroup({
      enrollmentNumber: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.required),
      degreeId: new FormControl('', Validators.required),
      placementCellId: new FormControl('', Validators.required),
    });

    // Add the studentForm to the parent form group
    this.parentFormGroup.addControl('studentForm', studentForm);

    // Subscribe to placementCellIdControl value changes
    this.placementCellIdControl?.valueChanges.subscribe((placementCellId) => {
      if (placementCellId) {
        this.updateDegreesForPlacementCell(placementCellId);
      }
    });
    // React to placement cells signal changes

    // Load saved data if available
    const savedData = this.registerService.studentProfile();
    if (savedData) {
      studentForm.patchValue(savedData);
    }

    // Subscribe to form value changes
    studentForm.valueChanges.subscribe((val) => {
      if (
        val.fullName !== undefined &&
        val.degreeId !== undefined &&
        val.enrollmentNumber !== undefined &&
        val.placementCellId !== undefined
      ) {
        this.registerService.setStudentProfile(val as StudentProfileFormModel);
      }
    });
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl('studentForm');
  }

  private updateDegreesForPlacementCell(placementCellId: string) {
    const selectedCell = this.placementCells().find(
      (cell) => cell.placementCellId === placementCellId
    );

    if (selectedCell) {
      this.degrees.set(
        selectedCell.placementCellDegrees.map((degree) => ({
          label: degree.name,
          value: degree.degreeId,
        }))
      );
    }
  }

  onPlacementCellSelected(placementCellId: string) {
    this.placementCellIdControl.setValue(placementCellId);
    this.placementCellIdControl.markAsDirty();
    this.placementCellIdControl.markAsTouched();

    const selectedCell = this.registerService
      .placementCells()
      .find((cell) => cell.placementCellId === placementCellId);

    if (selectedCell) {
      const userEmail = this.registerService.getUserDataEmail();

      if (userEmail) {
        const emailDomain = userEmail.split('@')[1];
        const placementCellDomain = selectedCell.placementCellDomains;

        if (placementCellDomain.some((domain) => domain === emailDomain)) {
          this.domainMismatchWarning.set(false);
          this.studentForm.setErrors(null); // Clear errors on the parent group
        } else {
          this.domainMismatchWarning.set(true);
          this.studentForm.setErrors({ domainMismatch: true }); // Set error on the parent group
        }
      } else {
        this.domainMismatchWarning.set(true);
        this.studentForm.setErrors({ domainMismatch: true }); // Set error if no email
      }
      console.log(this.studentForm.errors);
    }

    // Log the current errors on the parent form group
    console.log('Parent Form Group Errors:', this.parentFormGroup.errors);
  }

  onDegreeSelected(degreeId: string) {
    this.degreeIdControl.setValue(degreeId);
    this.degreeIdControl.markAsDirty();
    this.degreeIdControl.markAsTouched();
  }

  get studentForm() {
    return this.parentFormGroup.get('studentForm') as FormGroup;
  }

  get fullNameControl(): FormControl {
    return this.studentForm.get('fullName') as FormControl;
  }

  get enrollmentNumberControl(): FormControl {
    return this.studentForm.get('enrollmentNumber') as FormControl;
  }

  get degreeIdControl(): FormControl {
    return this.studentForm.get('degreeId') as FormControl;
  }

  get placementCellIdControl(): FormControl {
    return this.studentForm.get('placementCellId') as FormControl;
  }
}
