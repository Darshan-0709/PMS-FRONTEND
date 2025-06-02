import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../table.component';
import { TableConfig, TableEvent } from '../models/table.model';
import { PaginationInfo } from '../../pagination/pagination.component';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: Date;
}

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold mb-6">Data Table Component</h1>

      <!-- Basic Table -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold mb-3">Basic Table</h2>
        <p class="text-gray-600 mb-4">A simple table with sorting and pagination.</p>

        <app-table
          [data]="users"
          [config]="basicTableConfig"
          (tableEvent)="onTableEvent($event)"
        ></app-table>
      </div>

      <!-- Advanced Table -->
      <div class="mb-10">
        <h2 class="text-xl font-semibold mb-3">Advanced Table</h2>
        <p class="text-gray-600 mb-4">
          Table with all features enabled: sorting, searching, selection, pagination, and actions.
        </p>

        <div class="mb-4" *ngIf="selectedUsers.length > 0">
          <div class="bg-blue-50 p-3 rounded border border-blue-200">
            <p class="text-sm text-blue-800">
              {{ selectedUsers.length }} users selected.
              <button
                class="ml-2 text-blue-600 hover:text-blue-800 underline"
                (click)="clearSelection()"
              >
                Clear selection
              </button>
            </p>
          </div>
        </div>

        <app-table
          [data]="users"
          [config]="advancedTableConfig"
          (tableEvent)="onAdvancedTableEvent($event)"
        ></app-table>
      </div>

      <ng-template #statusTemplate let-user>
        <span
          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
          [class.bg-green-100]="user.status === 'active'"
          [class.text-green-800]="user.status === 'active'"
          [class.bg-red-100]="user.status === 'inactive'"
          [class.text-red-800]="user.status === 'inactive'"
          [class.bg-yellow-100]="user.status === 'pending'"
          [class.text-yellow-800]="user.status === 'pending'"
        >
          {{ user.status }}
        </span>
      </ng-template>

      <ng-template #dateTemplate let-user>
        {{ user.lastLogin | date: 'medium' }}
      </ng-template>
    </div>
  `,
  styles: [],
})
export class TableDemoComponent {
  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;

  users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: new Date(2023, 8, 15),
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'active',
      lastLogin: new Date(2023, 8, 20),
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Editor',
      status: 'inactive',
      lastLogin: new Date(2023, 7, 25),
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice@example.com',
      role: 'User',
      status: 'pending',
      lastLogin: new Date(2023, 8, 1),
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: new Date(2023, 8, 18),
    },
    {
      id: 6,
      name: 'Diana Prince',
      email: 'diana@example.com',
      role: 'Editor',
      status: 'active',
      lastLogin: new Date(2023, 8, 10),
    },
    {
      id: 7,
      name: 'Edward Miller',
      email: 'edward@example.com',
      role: 'User',
      status: 'inactive',
      lastLogin: new Date(2023, 6, 5),
    },
    {
      id: 8,
      name: 'Fiona Carter',
      email: 'fiona@example.com',
      role: 'User',
      status: 'active',
      lastLogin: new Date(2023, 8, 12),
    },
    {
      id: 9,
      name: 'George Wilson',
      email: 'george@example.com',
      role: 'Editor',
      status: 'pending',
      lastLogin: new Date(2023, 8, 3),
    },
    {
      id: 10,
      name: 'Helen Davis',
      email: 'helen@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: new Date(2023, 8, 22),
    },
    {
      id: 11,
      name: 'Ian Lewis',
      email: 'ian@example.com',
      role: 'User',
      status: 'active',
      lastLogin: new Date(2023, 8, 19),
    },
    {
      id: 12,
      name: 'Julia Martin',
      email: 'julia@example.com',
      role: 'User',
      status: 'inactive',
      lastLogin: new Date(2023, 7, 29),
    },
  ];

  selectedUsers: User[] = [];

  basicTableConfig: TableConfig<User> = {
    columns: [
      { field: 'id', header: 'ID', sortable: true },
      { field: 'name', header: 'Name', sortable: true },
      { field: 'email', header: 'Email', sortable: true },
      { field: 'role', header: 'Role', sortable: true },
    ],
    uniqueIdField: 'id',
    enableSorting: true,
    enablePagination: true,
    enableSearch: false,
    enableSelection: false,
    sortConfig: {
      active: 'name',
      direction: 'asc',
    },
    paginationConfig: {
      total: this.users.length,
      page: 1,
      pageSize: 5,
    },
  };

  advancedTableConfig: TableConfig<User> = {
    columns: [],
    uniqueIdField: 'id',
    enableSorting: true,
    enableSearch: true,
    enableSelection: true,
    enablePagination: true,
    enableActions: true,
    paginationConfig: {
      total: this.users.length,
      page: 1,
      pageSize: 5,
    },
  };

  constructor() {
    // Initialize advancedTableConfig immediately
    this.initializeAdvancedConfig();
  }

  initializeAdvancedConfig() {
    this.advancedTableConfig = {
      columns: [
        { field: 'id', header: 'ID', sortable: true, width: '80px' },
        { field: 'name', header: 'Name', sortable: true, searchable: true },
        { field: 'email', header: 'Email', sortable: true, searchable: true },
        { field: 'role', header: 'Role', sortable: true, searchable: true },
        {
          field: 'status',
          header: 'Status',
          sortable: true,
          cellTemplate: this.statusTemplate,
        },
        {
          field: 'lastLogin',
          header: 'Last Login',
          sortable: true,
          cellTemplate: this.dateTemplate,
        },
      ],
      uniqueIdField: 'id',
      enableSorting: true,
      enableSearch: true,
      enableSelection: true,
      enablePagination: true,
      enableActions: true,
      sortConfig: {
        active: 'name',
        direction: 'asc',
      },
      searchConfig: {
        term: '',
        fields: ['name', 'email', 'role'],
        caseSensitive: false,
      },
      selectionConfig: {
        mode: 'multiple',
        selectedItems: this.selectedUsers,
      },
      paginationConfig: {
        total: this.users.length,
        page: 1,
        pageSize: 5,
      },
      actionsConfig: {
        actions: [
          {
            type: 'view',
            label: 'View',
            icon: 'fa-eye',
            handler: user => this.viewUser(user),
          },
          {
            type: 'edit',
            label: 'Edit',
            icon: 'fa-edit',
            handler: user => this.editUser(user),
          },
          {
            type: 'delete',
            label: 'Delete',
            icon: 'fa-trash',
            isDisabled: user => user.role === 'Admin', // Disable for Admin users
            handler: user => this.deleteUser(user),
          },
        ],
        showLabels: true,
      },
    };
  }

  onTableEvent(event: TableEvent<User>): void {
    // Handle pagination config updates
    if (event.type === 'page' || event.type === 'pageSize') {
      // Create a new config object with updated pagination
      const newConfig = { ...this.basicTableConfig };

      newConfig.paginationConfig = {
        total: this.users.length,
        page: event.type === 'page' ? event.payload.page : 1,
        pageSize:
          event.type === 'pageSize'
            ? event.payload.pageSize
            : this.basicTableConfig.paginationConfig?.pageSize || 5,
      };

      // Force a new reference to trigger change detection
      this.basicTableConfig = newConfig;
    }

    // Handle sorting
    if (event.type === 'sort') {
      // Create a new config object with updated sorting
      const newConfig = { ...this.basicTableConfig };

      newConfig.sortConfig = {
        active: event.payload.field,
        direction: event.payload.direction,
      };

      // Force a new reference to trigger change detection
      this.basicTableConfig = newConfig;
    }
  }

  onAdvancedTableEvent(event: TableEvent<User>): void {
    console.log('Advanced table event:', event.type, event.payload);

    // Create a new config object to ensure change detection
    const newConfig = { ...this.advancedTableConfig };

    // Update selected users when selection changes
    if (event.type === 'select') {
      this.selectedUsers = [...event.payload];
      if (newConfig.selectionConfig) {
        newConfig.selectionConfig = {
          ...newConfig.selectionConfig,
          selectedItems: this.selectedUsers,
        };
      }
    }

    // Update pagination config
    if (event.type === 'page' || event.type === 'pageSize') {
      newConfig.paginationConfig = {
        total: this.users.length,
        page: event.type === 'page' ? event.payload.page : 1,
        pageSize:
          event.type === 'pageSize'
            ? event.payload.pageSize
            : newConfig.paginationConfig?.pageSize || 5,
      };
    }

    // Update search config
    if (event.type === 'search') {
      newConfig.searchConfig = { ...event.payload };
    }

    // Update sorting config
    if (event.type === 'sort') {
      newConfig.sortConfig = {
        active: event.payload.field,
        direction: event.payload.direction,
      };
    }

    // Apply the updated config (forcing a new reference)
    this.advancedTableConfig = newConfig;
  }

  clearSelection(): void {
    this.selectedUsers = [];

    // Create a new config to ensure change detection
    const newConfig = { ...this.advancedTableConfig };
    if (newConfig.selectionConfig) {
      newConfig.selectionConfig = {
        ...newConfig.selectionConfig,
        selectedItems: [],
      };
    }
    this.advancedTableConfig = newConfig;
  }

  // Action handlers
  viewUser(user: User): void {
    console.log('View user:', user);
    alert(`Viewing user: ${user.name}`);
  }

  editUser(user: User): void {
    console.log('Edit user:', user);
    alert(`Editing user: ${user.name}`);
  }

  deleteUser(user: User): void {
    console.log('Delete user:', user);
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      // Remove user from the array
      this.users = this.users.filter(u => u.id !== user.id);

      // Update both configs with new total
      const basicConfig = { ...this.basicTableConfig };
      if (basicConfig.paginationConfig) {
        basicConfig.paginationConfig = {
          ...basicConfig.paginationConfig,
          total: this.users.length,
        };
      }
      this.basicTableConfig = basicConfig;

      const advancedConfig = { ...this.advancedTableConfig };
      if (advancedConfig.paginationConfig) {
        advancedConfig.paginationConfig = {
          ...advancedConfig.paginationConfig,
          total: this.users.length,
        };
      }
      this.advancedTableConfig = advancedConfig;

      // Also remove from selection if selected
      if (this.selectedUsers.some(u => u.id === user.id)) {
        this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
      }
    }
  }
}
