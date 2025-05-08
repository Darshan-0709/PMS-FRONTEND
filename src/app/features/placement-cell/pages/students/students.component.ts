import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import {
  TableConfig,
  TableEvent,
  SearchConfig,
  SortConfig,
} from '../../../../shared/components/table/models/table.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { Pagination } from '../../../../core/config/api.config';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, TableComponent, PaginationComponent],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  // Inject required services
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // Template references for custom cell templates
  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate', { static: true })
  actionsTemplate!: TemplateRef<any>;
  @ViewChild('verifiedTemplate', { static: true })
  verifiedTemplate!: TemplateRef<any>;

  // State management
  students = signal<Student[]>([]);
  filteredStudents = signal<Student[]>([]); // For client-side filtering
  isLoading = signal(true);
  pagination = signal<Pagination>({
    total: 0,
    page: 1,
    pageSize: 5,
    totalPages: 0,
  });
  selectedStudents = signal<string[]>([]);

  // Sort and search state
  currentSort = signal<SortConfig<Student> | undefined>(undefined);
  currentSearch = signal<SearchConfig<Student> | undefined>(undefined);

  // Table configuration
  tableConfig!: TableConfig<Student>;

  ngOnInit(): void {
    this.loadStudents();
  }

  ngAfterViewInit(): void {
    // Initialize table configuration after view is initialized to access templates
    this.initializeTableConfig();
  }

  // Initialize table configuration with columns and features
  private initializeTableConfig(): void {
    this.tableConfig = {
      columns: [
        {
          field: 'enrollmentNumber',
          header: 'Enrollment',
          sortable: true,
          searchable: true,
        },
        {
          field: 'fullName',
          header: 'Name',
          sortable: true,
          searchable: true,
        },
        {
          field: 'degree.name',
          header: 'Degree',
          sortable: true,
        },
        {
          field: 'cgpa',
          header: 'CGPA',
          sortable: true,
        },
        {
          field: 'placementStatus',
          header: 'Status',
          sortable: true,
          cellTemplate: this.statusTemplate,
        },
        {
          field: 'isVerifiedByPlacementCell',
          header: 'Verified',
          sortable: true,
          cellTemplate: this.verifiedTemplate,
        },
        {
          field: 'actions',
          header: 'Actions',
          sortable: false,
          cellTemplate: this.actionsTemplate,
        },
      ],
      uniqueIdField: 'studentId',
      enableSorting: true,
      enableSearch: true,
      enableSelection: true,
      enablePagination: false, // We'll handle pagination separately
      enableActions: true,
      selectionConfig: {
        mode: 'multiple',
      },
    };
  }

  // Helper method to convert selection payload to studentIds
  private extractStudentIds(payload: any): string[] {
    // If it's already an array of IDs, return it
    if (Array.isArray(payload) && typeof payload[0] === 'string') {
      return payload;
    }

    // If it's an array of student objects
    if (
      Array.isArray(payload) &&
      payload.length > 0 &&
      typeof payload[0] === 'object'
    ) {
      return payload.map((student) => student.studentId);
    }

    // If it has a selectedIds property
    if (payload && Array.isArray(payload.selectedIds)) {
      return payload.selectedIds;
    }

    // If it has a selectedItems property containing student objects
    if (payload && Array.isArray(payload.selectedItems)) {
      return payload.selectedItems.map((student: Student) => student.studentId);
    }

    // Default case - empty array
    return [];
  }

  // Load students from the API with pagination
  loadStudents(page: number = 1): void {
    this.isLoading.set(true);
    const currentPagination = this.pagination();

    this.studentService
      .getStudents(page, currentPagination.pageSize)
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            const loadedStudents = response.data;
            this.students.set(loadedStudents);
            this.filteredStudents.set(loadedStudents);

            // Apply current sort and filter if they exist
            this.applyClientSideFilters();

            if (response.pagination) {
              this.pagination.set(response.pagination);
            }

            // Reset selection when loading new data
            this.selectedStudents.set([]);
          } else {
            this.toastService.show('Failed to load students', 'error');
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          this.toastService.show(`Error: ${error.message}`, 'error');
          this.isLoading.set(false);
        },
      });
  }

  // Apply current client-side sorting and filtering
  private applyClientSideFilters(): void {
    let processedData = [...this.students()];

    // Apply search if exists
    if (this.currentSearch()) {
      processedData = this.applySearch(processedData, this.currentSearch()!);
    }

    // Apply sort if exists
    if (this.currentSort()) {
      processedData = this.applySort(processedData, this.currentSort()!);
    }

    this.filteredStudents.set(processedData);

    // Update table config to ensure the UI reflects current state
    this.updateTableConfig();
  }

  // Apply search filter to data
  private applySearch(
    data: Student[],
    searchConfig: SearchConfig<Student>
  ): Student[] {
    if (!searchConfig.term) {
      return data;
    }

    let term = searchConfig.term;
    if (!searchConfig.caseSensitive) {
      term = term.toLowerCase();
    }

    const fields = searchConfig.fields || [];

    return data.filter((item) => {
      return fields.some((field) => {
        let value = this.getNestedValue(item, field as string);

        if (value === null || value === undefined) {
          return false;
        }

        value = String(value);

        if (!searchConfig.caseSensitive) {
          value = value.toLowerCase();
        }

        // Apply match mode
        switch (searchConfig.matchMode) {
          case 'startsWith':
            return value.startsWith(term);
          case 'exact':
            return value === term;
          case 'contains':
          default:
            return value.includes(term);
        }
      });
    });
  }

  // Apply sort to data
  private applySort(
    data: Student[],
    sortConfig: SortConfig<Student>
  ): Student[] {
    if (!sortConfig.active || !sortConfig.direction) {
      return data;
    }

    const field = sortConfig.active;
    const direction = sortConfig.direction;

    console.log(`Sorting by ${field} in ${direction} direction`);

    return [...data].sort((a, b) => {
      if (sortConfig.comparator) {
        return sortConfig.comparator(a, b, field as string);
      }

      const valueA = this.getNestedValue(a, field as string);
      const valueB = this.getNestedValue(b, field as string);

      if (valueA === valueB) return 0;

      // Handle numbers and strings differently
      let result;
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        result = valueA - valueB;
      } else {
        const strA = String(valueA || '');
        const strB = String(valueB || '');
        result = strA.localeCompare(strB);
      }

      return direction === 'asc' ? result : -result;
    });
  }

  // Get a nested property value using dot notation
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
  }

  // Update table configuration to match current state
  private updateTableConfig(): void {
    // Only update if table config exists
    if (!this.tableConfig) return;

    // Update sort config
    const currentSort = this.currentSort();
    if (currentSort) {
      this.tableConfig = {
        ...this.tableConfig,
        sortConfig: {
          ...this.tableConfig.sortConfig,
          active: currentSort.active,
          direction: currentSort.direction,
        },
      };
    }

    // Update search config
    const currentSearch = this.currentSearch();
    if (currentSearch) {
      this.tableConfig = {
        ...this.tableConfig,
        searchConfig: {
          ...this.tableConfig.searchConfig,
          ...currentSearch,
        },
      };
    }
  }

  // Handle table events (sorting, selection, etc.)
  onTableEvent(event: TableEvent<Student>): void {
    console.log('Table event received:', event.type);
    console.log('Event payload:', JSON.stringify(event.payload, null, 2));

    switch (event.type) {
      case 'select':
        // Use the helper method to extract student IDs consistently
        const selectedIds = this.extractStudentIds(event.payload);
        console.log('Extracted student IDs:', selectedIds);
        this.selectedStudents.set(selectedIds);
        console.log(
          'After setting, selectedStudents value:',
          this.selectedStudents()
        );
        break;

      case 'sort':
        // Handle sorting
        if (event.payload && event.payload.field) {
          const currentField = event.payload.field;
          const requestedDirection = event.payload.direction;

          console.log(
            `Sort event: ${currentField} in ${requestedDirection} direction`
          );

          // Get current sort state
          const currentSort = this.currentSort();

          // Determine new direction based on current state
          let newDirection = requestedDirection;

          // If same field is clicked, check if we need to toggle direction
          if (currentSort && currentSort.active === currentField) {
            // Force direction toggle if needed
            if (currentSort.direction === requestedDirection) {
              // Toggle direction when clicking same column twice with same direction
              newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
              console.log(`Toggling direction to ${newDirection}`);
            }
          }

          // Update sort config
          this.currentSort.set({
            active: currentField,
            direction: newDirection,
          });

          // Apply sorting - this will also update the table config
          this.applyClientSideFilters();
        }
        break;

      case 'search':
        // Handle search
        if (event.payload) {
          // Update search config
          this.currentSearch.set(event.payload);

          // Apply filtering
          this.applyClientSideFilters();
        }
        break;

      case 'action':
        if (event.payload.action === 'view') {
          this.viewStudent(event.payload.data.studentId);
        } else if (event.payload.action === 'edit') {
          this.editStudent(event.payload.data.studentId);
        }
        break;
    }
  }

  // Handle pagination events
  onPageChange(page: number): void {
    this.loadStudents(page);
  }

  // Navigation to student details page
  viewStudent(studentId: string): void {
    this.router.navigate(['/placement-cell/students', studentId]);
  }

  // Navigation to student edit page
  editStudent(studentId: string): void {
    this.router.navigate(['/placement-cell/students', studentId, 'edit']);
  }

  // Batch verify selected students
  verifySelectedStudents(verified: boolean): void {
    const selectedIds = this.selectedStudents();
    if (!selectedIds.length) {
      this.toastService.show('Please select students to verify', 'warning');
      return;
    }

    this.studentService
      .batchVerifyStudents({
        studentIds: selectedIds,
        isVerifiedByPlacementCell: verified,
      })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.show(
              `Successfully ${verified ? 'verified' : 'unverified'} ${
                response.data.count
              } students`,
              'success'
            );
            this.loadStudents(this.pagination().page);
          } else {
            this.toastService.show('Operation failed', 'error');
          }
        },
        error: (error) => {
          this.toastService.show(`Error: ${error.message}`, 'error');
        },
      });
  }

  // Manual toggle for student selection - can be used as a fallback
  toggleStudentSelection(studentId: string): void {
    const currentlySelected = this.selectedStudents();

    if (currentlySelected.includes(studentId)) {
      // Remove from selection
      this.selectedStudents.set(
        currentlySelected.filter((id) => id !== studentId)
      );
    } else {
      // Add to selection
      this.selectedStudents.set([...currentlySelected, studentId]);
    }

    console.log(
      'After manual toggle, selectedStudents:',
      this.selectedStudents()
    );
  }

  // Check if a specific student is selected
  isStudentSelected(studentId: string): boolean {
    return this.selectedStudents().includes(studentId);
  }
}
