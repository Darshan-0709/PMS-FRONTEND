import {
  Component,
  computed,
  effect,
  input,
  OnInit,
  Output,
  EventEmitter,
  output,
  signal,
} from '@angular/core';
import { SelectAllHeaderComponent } from '../select-all-header/select-all-header.component';
import { CommonModule } from '@angular/common';
import { SelectionStateDirective } from '../../../directives/selection-state.directive';
import { SortableHeaderDirective } from '../../../directives/sortable-header.directive';
import {
  TableConfig,
  TableViewState,
  PaginationConfig,
} from '../../../../models/table-configs';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-table-host',
  imports: [
    CommonModule,
    SelectAllHeaderComponent,
    SelectionStateDirective,
    SortableHeaderDirective,
    PaginationComponent,
  ],
  templateUrl: './table-host.component.html',
  styleUrl: './table-host.component.css',
  standalone: true,
})
export class TableHostComponent<T> implements OnInit {
  data = input<T[]>([]);
  config = input.required<TableConfig<T>>();
  finalList = output<T[]>();

  @Output() selectedRowsChange = new EventEmitter<T[]>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{
    field: keyof T;
    direction: 'asc' | 'desc';
  }>();

  viewState = signal<TableViewState<T>>({
    data: [],
    sortState: { field: null, direction: 'asc' },
    paginationState: { pageIndex: 0, pageSize: 10 },
    selectionState: { selectedItems: [] },
    filteredData: [],
    pagedData: [],
  });

  paginationConfig = computed<PaginationConfig | null>(() => {
    const state = this.viewState();
    const config = this.config();

    if (config.paginationConfig) {
      return config.paginationConfig;
    }

    if (config.enablePagination) {
      const total = state.data.length;
      const pageSize = state.paginationState.pageSize;
      return {
        total,
        page: state.paginationState.pageIndex + 1,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    }

    return null;
  });

  updateData = effect(() => {
    const currentData = this.data();
    this.viewState.update((state) => ({
      ...state,
      data: currentData,
      filteredData: currentData,
    }));
    this.recomputeView();
  });

  ngOnInit() {
    const config = this.config();
    this.viewState.update((state) => ({
      ...state,
      paginationState: {
        pageIndex: 0,
        pageSize: config.defaultPageSize ?? 10,
      },
    }));
  }

  recomputeView() {
    const state = this.viewState();
    let current = [...state.filteredData];

    // Sorting
    const { field, direction } = state.sortState;
    if (field && direction) {
      current.sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        const comp = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        return direction === 'asc' ? comp : -comp;
      });
    }

    // Pagination
    if (this.config().enablePagination) {
      const { pageIndex, pageSize } = state.paginationState;
      const start = pageIndex * pageSize;
      const end = start + pageSize;
      current = current.slice(start, end);
    }

    this.viewState.update((state) => ({
      ...state,
      pagedData: current,
    }));
  }

  onSelectionChange(selected: T[]) {
    this.viewState.update((state) => ({
      ...state,
      selectionState: { selectedItems: selected },
    }));
    this.selectedRowsChange.emit(selected);
  }

  onSelectAllChange(selected: T[]) {
    this.onSelectionChange(selected);
  }

  onSend() {
    this.finalList.emit(this.viewState().selectionState.selectedItems);
  }

  onSortChange(event: { field: keyof T; direction: 'asc' | 'desc' }) {
    this.viewState.update((state) => ({
      ...state,
      sortState: event,
    }));
    this.sortChange.emit(event);
    this.recomputeView();
  }

  onPageChange(page: number) {
    this.viewState.update((state) => ({
      ...state,
      paginationState: {
        ...state.paginationState,
        pageIndex: page - 1,
      },
    }));
    this.pageChange.emit(page);
    this.recomputeView();
  }
}
