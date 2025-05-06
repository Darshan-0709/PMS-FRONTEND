import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnDefinition, SearchConfig } from '../models/table.model';

@Component({
  selector: 'app-table-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="border-b border-gray-200 bg-white px-4 py-3 mb-3 flex items-center justify-between sm:px-6"
    >
      <div class="flex flex-1 items-center space-x-2">
        <!-- Search input -->
        <div class="relative flex-grow max-w-md">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <svg
              class="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="onSearchInput()"
            class="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search..."
            [attr.aria-label]="
              'Search in ' +
              (activeColumn()?.header || 'all searchable columns')
            "
          />
          @if (searchTerm.length > 0) {
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
            (click)="clearSearch()"
            aria-label="Clear search"
          >
            <svg
              class="h-5 w-5 text-gray-400 hover:text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          }
        </div>

        <!-- Column selector -->
        @if (searchableColumnsArray().length > 1) {
        <div>
          <select
            [(ngModel)]="selectedColumnField"
            (change)="onColumnChange()"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            aria-label="Select column to search"
          >
            <option value="">All searchable columns</option>
            @for (column of searchableColumnsArray(); track column.field) {
            <option [value]="column.field">{{ column.header }}</option>
            }
          </select>
        </div>
        }

        <!-- Case sensitive toggle -->
        <div class="flex items-center">
          <input
            type="checkbox"
            id="case-sensitive"
            [(ngModel)]="caseSensitive"
            (change)="onSearchSettingsChange()"
            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          />
          <label for="case-sensitive" class="ml-2 text-sm text-gray-600">
            Case sensitive
          </label>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class TableSearchComponent<T> {
  @Input() set searchConfig(config: SearchConfig<T> | undefined) {
    if (config) {
      this.searchTerm = config.term || '';
      this.selectedColumnField =
        config.fields?.length === 1 ? config.fields[0] : '';
      this.caseSensitive = config.caseSensitive || false;
      this.matchMode = config.matchMode || 'contains';
    }
  }

  @Input() columns: ColumnDefinition<T>[] = [];

  @Output() searchChange = new EventEmitter<SearchConfig<T>>();

  // Component state
  searchTerm = '';
  selectedColumnField = '';
  caseSensitive = false;
  matchMode: 'contains' | 'startsWith' | 'exact' = 'contains';

  // Computed values
  searchableColumns = computed(() =>
    this.columns.filter((col) => col.searchable)
  );

  // Helper method to get an array from the searchableColumns signal
  searchableColumnsArray = computed(() => this.searchableColumns());

  activeColumn = computed(() => {
    if (!this.selectedColumnField) return null;
    return (
      this.searchableColumns().find(
        (col) => col.field === this.selectedColumnField
      ) || null
    );
  });

  // Search handlers
  onSearchInput(): void {
    // Short delay to avoid too many events while typing
    setTimeout(() => this.emitSearchChange(), 200);
  }

  onColumnChange(): void {
    this.emitSearchChange();
  }

  onSearchSettingsChange(): void {
    this.emitSearchChange();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.emitSearchChange();
  }

  private emitSearchChange(): void {
    const searchConfig: SearchConfig<T> = {
      term: this.searchTerm,
      caseSensitive: this.caseSensitive,
      matchMode: this.matchMode,
    };

    // If a specific column is selected, search only in that column
    if (this.selectedColumnField) {
      searchConfig.fields = [this.selectedColumnField as any]; // Type assertion needed here
    } else {
      // Otherwise search in all searchable columns
      searchConfig.fields = this.searchableColumns().map((col) => col.field);
    }

    this.searchChange.emit(searchConfig);
  }
}
