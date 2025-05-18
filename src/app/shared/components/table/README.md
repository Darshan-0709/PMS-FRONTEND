# Angular Data Table Component

A powerful, customizable data table component for Angular applications built with signals.

## Features

- ✅ **Sorting**: Click column headers to sort data
- ✅ **Searching**: Filter data with customizable search options
- ✅ **Selection**: Select rows with single or multiple selection
- ✅ **Pagination**: Navigate through data with built-in pagination
- ✅ **Actions**: Add custom row actions (view, edit, delete, etc.)
- ✅ **Custom Templates**: Use templates for custom cell rendering
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Accessibility**: Built with ARIA support

## Table Architecture

The table component is designed with modularity in mind:

- **TableComponent**: Main orchestrator
- **TableHeaderComponent**: Manages column headers and sorting
- **TableBodyComponent**: Renders rows and handles selection
- **TableSearchComponent**: Handles search functionality
- **Pagination Integration**: Uses our existing pagination component

## Usage

### Basic Example

```typescript
import { Component } from '@angular/core';
import { TableComponent } from '../shared/components/table/table.component';
import { TableConfig } from '../shared/components/table/models/table.model';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [TableComponent],
  template: `
    <app-table
      [data]="items"
      [config]="tableConfig"
      (tableEvent)="onTableEvent($event)"
    ></app-table>
  `
})
export class MyComponent {
  items = [
    { id: 1, name: 'Item 1', description: 'Description 1' },
    { id: 2, name: 'Item 2', description: 'Description 2' },
    // ...more items
  ];
  
  tableConfig: TableConfig<any> = {
    columns: [
      { field: 'id', header: 'ID', sortable: true },
      { field: 'name', header: 'Name', sortable: true, searchable: true },
      { field: 'description', header: 'Description', searchable: true }
    ],
    uniqueIdField: 'id',
    enableSorting: true,
    enablePagination: true,
    paginationConfig: {
      total: this.items.length,
      page: 1,
      pageSize: 10
    }
  };
  
  onTableEvent(event: any): void {
    console.log('Table event:', event.type, event.payload);
    // Handle events like pagination, sorting, etc.
  }
}
```

### Advanced Configuration

To see a complete example with all features enabled, check the `TableDemoComponent` at `src/app/shared/components/table/table-demo/table-demo.component.ts`.

## Configuration Options

### TableConfig

The main configuration interface for the table:

```typescript
interface TableConfig<T> {
  columns: ColumnDefinition<T>[];
  uniqueIdField?: keyof T;
  
  enableSorting?: boolean;
  enableSearch?: boolean;
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableActions?: boolean;
  
  sortConfig?: SortConfig<T>;
  searchConfig?: SearchConfig<T>;
  selectionConfig?: SelectionConfig;
  paginationConfig?: PaginationInfo;
  actionsConfig?: ActionsConfig<T>;
}
```

### ColumnDefinition

Defines each column in the table:

```typescript
interface ColumnDefinition<T> {
  field: Extract<keyof T, string> | string;
  header: string;
  
  sortable?: boolean;
  searchable?: boolean;
  visible?: boolean;
  width?: string;
  
  cellTemplate?: TemplateRef<any>;
  headerTemplate?: TemplateRef<any>;
  cellClass?: string | ((data: T) => string);
}
```

## Events

The table emits events through the `tableEvent` output. Each event has a `type` and `payload`:

- `sort`: When sorting changes
- `search`: When search criteria change
- `select`: When selection changes
- `page`: When current page changes
- `pageSize`: When page size changes
- `action`: When a row action is triggered

## Custom Templates

You can use custom templates for cell rendering:

```html
<app-table [data]="items" [config]="tableConfig"></app-table>

<ng-template #statusTemplate let-item>
  <span [ngClass]="getStatusClass(item.status)">
    {{ item.status }}
  </span>
</ng-template>
```

```typescript
@ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;

ngAfterViewInit() {
  this.tableConfig = {
    columns: [
      // ...other columns
      {
        field: 'status',
        header: 'Status',
        cellTemplate: this.statusTemplate
      }
    ],
    // ...other config
  };
}
```

## Styling

The table uses Tailwind CSS for styling. You can customize the appearance by overriding these styles or by adding custom classes to columns and cells. 