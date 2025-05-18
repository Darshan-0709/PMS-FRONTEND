import { Component, EventEmitter, Input, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionsConfig, ColumnDefinition, TableAction } from '../models/table.model';

@Component({
  selector: 'app-table-body',
  standalone: true,
  imports: [CommonModule],
  template: `
    <tbody class="divide-y divide-gray-200 bg-white">
      @if (data.length === 0) {
        <tr>
          <td [attr.colspan]="totalColumns()" class="py-10 text-center text-gray-500 text-sm">
            {{ emptyMessage }}
          </td>
        </tr>
      }
      @for (item of data; track trackBy(item); let i = $index) {
        <tr class="hover:bg-gray-50" [class.bg-indigo-50]="isSelected(item)">
          <!-- Selection checkbox column -->
          @if (enableSelection) {
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  [checked]="isSelected(item)"
                  (change)="onSelectChange($event, item)"
                  aria-label="Select row"
                />
              </div>
            </td>
          }

          <!-- Data columns -->
          @for (column of columns; track column.field) {
            <td class="whitespace-nowrap px-3 py-4 text-sm" [class]="getCellClass(column, item)">
              @if (column.cellTemplate) {
                <ng-container
                  [ngTemplateOutlet]="column.cellTemplate"
                  [ngTemplateOutletContext]="{
                    $implicit: item,
                    index: i,
                    column: column,
                  }"
                ></ng-container>
              } @else {
                {{ getCellValue(item, column.field) }}
              }
            </td>
          }

          <!-- Actions column -->
          @if (hasActions()) {
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
              @for (action of getVisibleActions(item); track action.type) {
                <button
                  type="button"
                  class="ml-2 px-2 py-1 rounded text-sm"
                  [ngClass]="[action.customClass || '', getActionColorClass(action)]"
                  [class.opacity-50]="isActionDisabled(action, item)"
                  [class.cursor-not-allowed]="isActionDisabled(action, item)"
                  [disabled]="isActionDisabled(action, item)"
                  [attr.aria-label]="action.label"
                  [title]="action.tooltip || action.label"
                  (click)="onActionClick(action, item)"
                >
                  @if (action.icon) {
                    <i [ngClass]="action.icon"></i>
                  }
                  @if (showActionLabels()) {
                    <span class="ml-1">{{ action.label }}</span>
                  }
                </button>
              }
            </td>
          }
        </tr>
      }
    </tbody>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class TableBodyComponent<T> {
  @Input() data: T[] = [];
  @Input() columns: ColumnDefinition<T>[] = [];
  @Input() enableSelection: boolean = false;
  @Input() selectedItems: any[] = [];
  @Input() uniqueIdField?: keyof T;
  @Input() actionsConfig?: ActionsConfig<T>;
  @Input() emptyMessage: string = 'No data available';

  @Output() select = new EventEmitter<T[]>();
  @Output() action = new EventEmitter<{ action: TableAction<T>; item: T }>();

  // Computed values
  protected hasActions = computed(
    () => !!this.actionsConfig && this.actionsConfig.actions.length > 0
  );
  protected showActionLabels = computed(() => this.actionsConfig?.showLabels ?? false);

  // Calculate total number of columns including selection and actions
  protected totalColumns = computed(() => {
    let count = this.columns.length;
    if (this.enableSelection) count += 1;
    if (this.hasActions()) count += 1;
    return count;
  });

  // Track items by their unique ID or by index if no ID field provided
  trackBy(item: T): any {
    return this.uniqueIdField ? item[this.uniqueIdField] : item;
  }

  // Get a value from an object using dot notation for nested properties
  getCellValue(item: T, field: string): any {
    return field.split('.').reduce((obj, key) => {
      return obj && obj[key] !== undefined ? obj[key] : '';
    }, item as any);
  }

  // Get the CSS class for a cell (string or function)
  getCellClass(column: ColumnDefinition<T>, item: T): string {
    if (typeof column.cellClass === 'function') {
      const result = column.cellClass(item);
      // If result is an object, convert it to space-separated class string
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        return Object.entries(result)
          .filter(([_, value]) => !!value)
          .map(([key]) => key)
          .join(' ');
      }
      // If result is an array, join it
      if (Array.isArray(result)) {
        return result.join(' ');
      }
      return result || '';
    }
    return column.cellClass || '';
  }

  // Check if an item is selected
  isSelected(item: T): boolean {
    return this.selectedItems.some(selected =>
      this.uniqueIdField
        ? selected[this.uniqueIdField] === item[this.uniqueIdField]
        : selected === item
    );
  }

  // Handle selection changes
  onSelectChange(event: Event, item: T): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;

    let updatedSelection: T[];

    if (isChecked) {
      // Add to selection if not already selected
      updatedSelection = this.isSelected(item)
        ? [...this.selectedItems]
        : [...this.selectedItems, item];
    } else {
      // Remove from selection
      updatedSelection = this.selectedItems.filter(selected =>
        this.uniqueIdField
          ? selected[this.uniqueIdField] !== item[this.uniqueIdField]
          : selected !== item
      );
    }

    this.select.emit(updatedSelection);
  }

  // Get actions that should be visible for this item
  getVisibleActions(item: T): TableAction<T>[] {
    if (!this.actionsConfig) return [];

    return this.actionsConfig.actions.filter(action => {
      if (action.isVisible) {
        return action.isVisible(item);
      }
      return true;
    });
  }

  // Check if an action is disabled for this item
  isActionDisabled(action: TableAction<T>, item: T): boolean {
    return action.isDisabled ? action.isDisabled(item) : false;
  }

  // Get CSS class for action button based on type
  getActionColorClass(action: TableAction<T>): string {
    if (action.color) return action.color;

    switch (action.type) {
      case 'edit':
        return 'text-blue-600 hover:text-blue-900';
      case 'delete':
        return 'text-red-600 hover:text-red-900';
      case 'view':
        return 'text-green-600 hover:text-green-900';
      default:
        return 'text-gray-600 hover:text-gray-900';
    }
  }

  // Handle action button clicks
  onActionClick(action: TableAction<T>, item: T): void {
    if (action.handler) {
      action.handler(item);
    } else {
      this.action.emit({ action, item });
    }
  }
}
