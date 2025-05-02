import {
  Component,
  effect,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedInputComponent } from '../../../../shared/components/shared-input/shared-input.component';
import { ValidationErrorsComponent } from '../../../../shared/components/validation-errors/validation-errors.component';
import { defaultValidationMessages } from '../../../../shared/types/validation.types';
import {
  AutoCompleteComponent,
  SelectOption,
} from '../../../../shared/components/auto-complete/auto-complete.component';
import { RegisterService } from '../register.service';
import { DropdownAutocompleteComponentComponent } from '../../../../shared/components/dropdown-autocomplete-component/dropdown-autocomplete-component.component';
import { tap, catchError, throwError } from 'rxjs';
import { Branch, Degree, PlacementCellApiData } from '../../user.mode';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
  imports: [
    SharedInputComponent,
    ValidationErrorsComponent,
    DropdownAutocompleteComponentComponent,
    ReactiveFormsModule,
  ],
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;

  validationMessages = defaultValidationMessages;
  registerService = inject(RegisterService);
  registrationSuccess = output<{ message: string }>();

  // Signals for data management
  branches = signal<SelectOption<string>[]>([]);
  placementCells = signal<PlacementCellApiData[]>([]);
  placementCellAutoCompleteList = signal<SelectOption<string>[]>([]);
  degrees = signal<SelectOption<string>[]>([]);

  constructor() {
    this.studentForm = new FormGroup({
      enrollmentNumber: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.required),
      degreeId: new FormControl('', Validators.required),
      placementCellId: new FormControl('', Validators.required),
      branchId: new FormControl('', Validators.required),
    });

    // Listen for branch selection changes
    this.branchIdControl.valueChanges.subscribe((branchId) => {
      if (branchId) {
        this.filterPlacementCellsByBranch(branchId);
      }
    });

    // Listen for placement cell selection changes
    this.placementCellIdControl.valueChanges.subscribe((placementCellId) => {
      if (placementCellId) {
        this.updateDegreesForPlacementCell(placementCellId);
      }
    });

    // React to branches signal changes
    effect(() => {
      const branches = this.registerService.branches();
      if (branches && branches.length > 0) {
        this.branches.set(
          branches.map((branch) => ({
            label: branch.name,
            value: branch.branchId,
          }))
        );
      }
    });

    // React to placement cells signal changes
    effect(() => {
      const cells = this.registerService.placementCells();
      if (cells && cells.length > 0) {
        this.placementCells.set(cells);
        this.updatePlacementCellList();
      }
    });
  }

  ngOnInit(): void {
    // Fetch data from service
    this.registerService.fetchData();
  }

  private updatePlacementCellList() {
    this.placementCellAutoCompleteList.set(
      this.placementCells().map((cell) => ({
        label: cell.placementCellName,
        value: cell.placementCellId,
      }))
    );
  }

  private filterPlacementCellsByBranch(branchId: string) {
    const filteredCells = this.placementCells().filter(
      (cell) => cell.branch.branchId === branchId
    );

    this.placementCellAutoCompleteList.set(
      filteredCells.map((cell) => ({
        label: cell.placementCellName,
        value: cell.placementCellId,
      }))
    );
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

  onBranchSelected(branchId: string) {
    this.branchIdControl.setValue(branchId);
    this.branchIdControl.markAsDirty();
    this.branchIdControl.markAsTouched();
  }

  onPlacementCellSelected(placementCellId: string) {
    this.placementCellIdControl.setValue(placementCellId);
    this.placementCellIdControl.markAsDirty();
    this.placementCellIdControl.markAsTouched();
  }

  onDegreeSelected(degreeId: string) {
    this.degreeIdControl.setValue(degreeId);
    this.degreeIdControl.markAsDirty();
    this.degreeIdControl.markAsTouched();
  }

  onSubmit() {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    const formData = this.studentForm.getRawValue();
    this.registerService.setProfileFormData(formData);

    this.registerService
      .submitRegistration()
      .pipe(
        tap((response) => {
          if (response.success) {
            this.registrationSuccess.emit({ message: response.message });
          }
        }),
        catchError((err) => {
          Object.entries(err).forEach(([key, message]) => {
            const control = this.studentForm.get(key);
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

  get branchIdControl(): FormControl {
    return this.studentForm.get('branchId') as FormControl;
  }
}
