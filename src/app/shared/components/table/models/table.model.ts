import { TemplateRef } from '@angular/core';
import { PaginationInfo } from '../../../components/pagination/pagination.component';

/**
 * Defines the structure of a column in the table
 */
export interface ColumnDefinition<T> {
  // Core properties
  field: Extract<keyof T, string> | string; // Support for nested properties with dot notation
  header: string;

  // Optional display properties
  sortable?: boolean;
  searchable?: boolean;
  visible?: boolean;
  width?: string;

  // Custom rendering
  cellTemplate?: TemplateRef<any>; // Custom cell rendering
  headerTemplate?: TemplateRef<any>; // Custom header rendering
  cellClass?: string | ((data: T) => string); // Dynamic styling
}

/**
 * Configuration for table sorting
 */
export interface SortConfig<T> {
  active?: Extract<keyof T, string> | string;
  direction?: 'asc' | 'desc' | '';
  comparator?: (a: T, b: T, field: string) => number; // Custom sorting logic
}

/**
 * Configuration for table search functionality
 */
export interface SearchConfig<T> {
  term?: string;
  fields?: Array<Extract<keyof T, string> | string>; // Fields to search in
  caseSensitive?: boolean;
  matchMode?: 'contains' | 'startsWith' | 'exact';
}

/**
 * Configuration for row selection
 */
export interface SelectionConfig {
  mode?: 'none' | 'single' | 'multiple';
  selectedItems?: any[];
  selectionTracker?: (item: any) => any; // Function to track selection by value
}

/**
 * Configuration for row actions (edit, delete, view, etc.)
 */
export interface ActionsConfig<T> {
  actions: TableAction<T>[];
  position?: 'start' | 'end';
  showLabels?: boolean;
}

/**
 * Definition of a table action (button)
 */
export interface TableAction<T> {
  type: 'edit' | 'delete' | 'view' | 'custom';
  label?: string;
  icon?: string;
  tooltip?: string;
  isVisible?: (item: T) => boolean; // Conditional visibility
  isDisabled?: (item: T) => boolean; // Conditional enabling
  color?: string;
  customClass?: string;
  handler?: (item: T) => void; // Optional direct handler
}

/**
 * Events emitted by the table component
 */
export interface TableEvent<T> {
  type: 'sort' | 'search' | 'select' | 'page' | 'pageSize' | 'action';
  payload: any;
  originalData?: T[];
}

/**
 * Primary configuration for the table component
 */
export interface TableConfig<T> {
  // Required
  columns: ColumnDefinition<T>[];
  uniqueIdField?: keyof T; // Optional, fallback to index if not provided

  // Features toggles (all optional with defaults)
  enableSorting?: boolean;
  enableSearch?: boolean;
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableActions?: boolean;

  // Sub-configurations (only needed if feature enabled)
  sortConfig?: SortConfig<T>;
  searchConfig?: SearchConfig<T>;
  selectionConfig?: SelectionConfig;
  paginationConfig?: PaginationInfo;
  actionsConfig?: ActionsConfig<T>;
}
