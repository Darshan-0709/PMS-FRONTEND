import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDefinition, SortConfig } from '../models/table.model';

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <thead class="bg-gray-50 text-gray-700">
      <tr>
        <!-- Selection checkbox column -->
        @if (enableSelection) {
          <th class="w-14 px-3 py-3.5">
            <div class="flex items-center">
              <input
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                [checked]="allSelected"
                (change)="onSelectAllChange($event)"
                [disabled]="disabled"
                aria-label="Select all rows"
              />
            </div>
          </th>
        }

        <!-- Column headers -->
        @for (column of columns; track column.field) {
          <th
            class="px-3 py-3.5 text-left text-sm font-semibold"
            [ngClass]="{
              'cursor-pointer hover:bg-gray-100': column.sortable,
            }"
            [style.width]="column.width"
            (click)="column.sortable ? onSortClick(column.field) : null"
          >
            <div class="group inline-flex items-center">
              {{ column.header }}

              <!-- Sort icon -->
              @if (column.sortable) {
                <span class="ml-2 flex-none rounded">
                  @if (isSortedColumn(column.field)) {
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      @if (sortDirection() === 'asc') {
                        <path
                          fill-rule="evenodd"
                          d="M10 5a.75.75 0 01.75.75v6.638l2.96-3.027a.75.75 0 111.08 1.04l-4.25 4.35a.75.75 0 01-1.08 0l-4.25-4.35a.75.75 0 111.08-1.04l2.96 3.027V5.75A.75.75 0 0110 5z"
                          clip-rule="evenodd"
                        />
                      } @else {
                        <path
                          fill-rule="evenodd"
                          d="M10 15a.75.75 0 01-.75-.75V7.612L6.29 10.64a.75.75 0 11-1.08-1.04l4.25-4.35a.75.75 0 011.08 0l4.25 4.35a.75.75 0 11-1.08 1.04l-2.96-3.027v6.638A.75.75 0 0110 15z"
                          clip-rule="evenodd"
                        />
                      }
                    </svg>
                  } @else {
                    <svg
                      class="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  }
                </span>
              }
            </div>
          </th>
        }

        <!-- Actions column if needed -->
        @if (hasActions) {
          <th class="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span class="sr-only">Actions</span>
          </th>
        }
      </tr>
    </thead>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class TableHeaderComponent<T> {
  @Input() columns: ColumnDefinition<T>[] = [];
  @Input() enableSelection: boolean = false;
  @Input() hasActions: boolean = false;
  @Input() allSelected: boolean = false;
  @Input() disabled: boolean = false;
  @Input() sortConfig?: SortConfig<T>;

  @Output() sort = new EventEmitter<{
    field: string;
    direction: 'asc' | 'desc' | '';
  }>();
  @Output() selectAll = new EventEmitter<boolean>();

  // Computed properties for sorting state
  protected sortedColumn = computed(() => this.sortConfig?.active || '');
  protected sortDirection = computed(() => this.sortConfig?.direction || '');

  // Check if a column is the currently sorted column
  protected isSortedColumn(field: string): boolean {
    return this.sortedColumn() === field && !!this.sortDirection();
  }

  // Handler for sort header clicks
  onSortClick(field: string): void {
    let direction: 'asc' | 'desc' | '' = 'asc';

    // Toggle sort direction if already sorting by this column
    if (this.sortedColumn() === field) {
      if (this.sortDirection() === 'asc') {
        direction = 'desc';
      } else if (this.sortDirection() === 'desc') {
        direction = ''; // Remove sorting
      }
    }

    this.sort.emit({ field, direction });
  }

  // Handler for select all checkbox
  onSelectAllChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.selectAll.emit(checkbox.checked);
  }
}
