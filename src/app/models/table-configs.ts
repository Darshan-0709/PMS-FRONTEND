// src/models/table-configs.ts
export interface ColumnConfig<T> {
  /** Human-readable header text */
  header: string;
  /** Key on T to render in this column */
  field: keyof T;
  /** Optional feature flags */
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  /** Cell type, for future custom templates */
  type?: 'string' | 'number' | 'date' | 'boolean' | 'custom';
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface PaginationConfig {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TableConfig<T> {
  columns: ColumnConfig<T>[]; // List of column configurations
  enableSorting?: boolean; // Enable sorting for the table
  enableFiltering?: boolean; // Enable filtering for the table
  enableSelection?: boolean; // Enable row selection
  enablePagination?: boolean; // Enable pagination for the table
  paginationConfig?: PaginationConfig;
  pageSizeOptions?: number[]; // Available page sizes
  defaultPageSize?: number; // Default page size
  rowHeight?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  customPagination?: boolean;
}

export interface TableViewState<T> {
  data: T[];
  sortState: { field: keyof T | null; direction: 'asc' | 'desc' };
  paginationState: { pageIndex: number; pageSize: number };
  selectionState: { selectedItems: T[] };
  filteredData: T[];
  pagedData: T[];
}
