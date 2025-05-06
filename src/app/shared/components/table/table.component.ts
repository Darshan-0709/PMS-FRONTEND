import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActionsConfig,
  ColumnDefinition,
  SearchConfig,
  SortConfig,
  TableConfig,
  TableEvent,
} from './models/table.model';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableBodyComponent } from './table-body/table-body.component';
import { TableSearchComponent } from './table-search/table-search.component';
import {
  PaginationComponent,
  PaginationInfo,
} from '../pagination/pagination.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    TableHeaderComponent,
    TableBodyComponent,
    TableSearchComponent,
    PaginationComponent,
  ],
  template: `
    <div
      class="table-container overflow-hidden rounded-lg border border-gray-200 shadow"
    >
      <!-- Search Section -->
      @if (config?.enableSearch) {
      <app-table-search
        [searchConfig]="config.searchConfig || {}"
        [columns]="columns()"
        (searchChange)="onSearchChange($event)"
      ></app-table-search>
      }

      <!-- Table Section -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <app-table-header
            [columns]="visibleColumns()"
            [enableSelection]="config?.enableSelection || false"
            [hasActions]="hasActions()"
            [allSelected]="allSelected()"
            [sortConfig]="config?.sortConfig"
            (sort)="onSort($event)"
            (selectAll)="onSelectAll($event)"
          ></app-table-header>

          <app-table-body
            [data]="processedData()"
            [columns]="visibleColumns()"
            [uniqueIdField]="config?.uniqueIdField"
            [enableSelection]="config?.enableSelection || false"
            [selectedItems]="selectedItems()"
            [actionsConfig]="config?.actionsConfig"
            (select)="onSelect($event)"
            (action)="onAction($event)"
          ></app-table-body>
        </table>
      </div>

      <!-- Pagination Section -->
      @if (config?.enablePagination) {
      <div
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <app-pagination
          [pagination]="paginationState()"
          [showTotal]="true"
          [showPageSize]="true"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>
      </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .table-container {
        @apply bg-white;
      }
    `,
  ],
})
export class TableComponent<T> implements OnChanges {
  @Input() data: T[] = [];
  @Input() config: TableConfig<T> = {
    columns: [],
    enablePagination: false,
    enableSelection: false,
    enableSearch: false,
    enableSorting: false,
    enableActions: false,
  };

  @Output() tableEvent = new EventEmitter<TableEvent<T>>();

  // Signals for reactive state
  private rawData = signal<T[]>([]);
  private filteredData = computed(() => this.applySearch(this.rawData()));
  private sortedData = computed(() => this.applySort(this.filteredData()));
  processedData = computed(() => this.applyPagination(this.sortedData()));

  // Computed values
  columns = computed(() => this.config?.columns || []);

  visibleColumns = computed(() =>
    this.columns().filter((col) => col.visible !== false)
  );

  searchableColumns = computed(() =>
    this.columns().filter((col) => col.searchable)
  );

  selectedItems = signal<T[]>([]);

  allSelected = computed(() => {
    const items = this.processedData();
    return items.length > 0 && this.selectedItems().length === items.length;
  });

  hasActions = computed(
    () =>
      !!this.config?.actionsConfig &&
      this.config.actionsConfig.actions.length > 0
  );

  paginationState = computed<PaginationInfo>(() => ({
    total: this.filteredData().length,
    page: this.config.paginationConfig?.page || 1,
    pageSize: this.config.paginationConfig?.pageSize || 10,
    totalPages: Math.ceil(
      this.filteredData().length /
        (this.config.paginationConfig?.pageSize || 10)
    ),
  }));

  ngOnChanges(changes: SimpleChanges): void {
    // Always ensure data is set
    if (changes['data']) {
      this.rawData.set(this.data ? [...this.data] : []);
    }

    // Handle config changes
    if (changes['config']) {
      // Ensure that if selectionConfig exists, set the selectedItems
      if (this.config?.selectionConfig?.selectedItems) {
        this.selectedItems.set([...this.config.selectionConfig.selectedItems]);
      }

      // If only config changed but data didn't, we need to refresh the data processing
      if (!changes['data'] && this.data) {
        this.rawData.set([...this.data]);
      }
    }
  }

  // Event handlers
  onSearchChange(searchConfig: SearchConfig<T>): void {
    // Update search config
    if (this.config) {
      this.config = {
        ...this.config,
        searchConfig,
      };
    }

    this.tableEvent.emit({
      type: 'search',
      payload: searchConfig,
      originalData: this.data,
    });
  }

  onSort(event: { field: string; direction: 'asc' | 'desc' | '' }): void {
    // Update sort config
    if (this.config) {
      this.config = {
        ...this.config,
        sortConfig: {
          ...this.config.sortConfig,
          active: event.field,
          direction: event.direction,
        },
      };
    }

    this.tableEvent.emit({
      type: 'sort',
      payload: event,
      originalData: this.data,
    });
  }

  onSelect(items: T[]): void {
    // Update selected items
    this.selectedItems.set(items);

    if (this.config) {
      this.config = {
        ...this.config,
        selectionConfig: {
          ...this.config.selectionConfig,
          selectedItems: items,
        },
      };
    }

    this.tableEvent.emit({
      type: 'select',
      payload: items,
      originalData: this.data,
    });
  }

  onSelectAll(selected: boolean): void {
    const newSelection = selected ? [...this.processedData()] : [];
    this.selectedItems.set(newSelection);

    if (this.config) {
      this.config = {
        ...this.config,
        selectionConfig: {
          ...this.config.selectionConfig,
          selectedItems: newSelection,
        },
      };
    }

    this.tableEvent.emit({
      type: 'select',
      payload: newSelection,
      originalData: this.data,
    });
  }

  onAction(event: { action: any; item: T }): void {
    this.tableEvent.emit({
      type: 'action',
      payload: event,
      originalData: this.data,
    });
  }

  onPageChange(page: number): void {
    // Update pagination config
    if (this.config && this.config.paginationConfig) {
      this.config = {
        ...this.config,
        paginationConfig: {
          ...this.config.paginationConfig,
          page,
          total: this.filteredData().length, // Ensure total is always set
          pageSize: this.config.paginationConfig.pageSize || 10,
        },
      };
    } else if (this.config) {
      // If paginationConfig doesn't exist, create it
      this.config = {
        ...this.config,
        paginationConfig: {
          page,
          total: this.filteredData().length,
          pageSize: 10,
        },
      };
    }

    this.tableEvent.emit({
      type: 'page',
      payload: { page },
      originalData: this.data,
    });
  }

  onPageSizeChange(pageSize: number): void {
    // Update page size and reset to page 1
    if (this.config && this.config.paginationConfig) {
      this.config = {
        ...this.config,
        paginationConfig: {
          ...this.config.paginationConfig,
          pageSize,
          page: 1, // Reset to first page when changing page size
          total: this.filteredData().length, // Ensure total is always set
        },
      };
    } else if (this.config) {
      // If paginationConfig doesn't exist, create it
      this.config = {
        ...this.config,
        paginationConfig: {
          pageSize,
          page: 1,
          total: this.filteredData().length,
        },
      };
    }

    this.tableEvent.emit({
      type: 'pageSize',
      payload: { pageSize },
      originalData: this.data,
    });
  }

  // Data processing methods
  private applySearch(data: T[]): T[] {
    if (!this.config?.enableSearch || !this.config.searchConfig?.term) {
      return data;
    }

    const config = this.config.searchConfig;
    let term = config.term || '';
    if (!config.caseSensitive) {
      term = term.toLowerCase();
    }

    const fields =
      config.fields || this.searchableColumns().map((col) => col.field);

    return data.filter((item) => {
      return fields.some((field) => {
        let value = this.getNestedValue(item, field as string);

        if (value === null || value === undefined) {
          return false;
        }

        value = String(value);

        if (!config.caseSensitive) {
          value = value.toLowerCase();
        }

        // Apply match mode
        switch (config.matchMode) {
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

  private applySort(data: T[]): T[] {
    if (
      !this.config?.enableSorting ||
      !this.config.sortConfig?.active ||
      !this.config.sortConfig.direction
    ) {
      return data;
    }

    const field = this.config.sortConfig.active;
    const direction = this.config.sortConfig.direction;

    return [...data].sort((a, b) => {
      if (this.config.sortConfig?.comparator) {
        return this.config.sortConfig.comparator(a, b, field as string);
      }

      const valueA = this.getNestedValue(a, field as string);
      const valueB = this.getNestedValue(b, field as string);

      if (valueA === valueB) return 0;

      const result = valueA > valueB ? 1 : -1;
      return direction === 'asc' ? result : -result;
    });
  }

  private applyPagination(data: T[]): T[] {
    if (!this.config?.enablePagination) {
      return data;
    }

    const page = this.config.paginationConfig?.page || 1;
    const pageSize = this.config.paginationConfig?.pageSize || 10;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return data.slice(start, end);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
  }
}
