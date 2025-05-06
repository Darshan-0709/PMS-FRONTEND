import { Component } from '@angular/core';
import {
  TableConfig,
  TableEvent,
} from '../../../../shared/components/table/models/table.model';
import { TableComponent } from '../../../../shared/components/table/table.component';
import {
  PaginationInfo,
} from '../../../../shared/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { TableDemoComponent } from "../../../../shared/components/table/table-demo/table-demo.component";
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: Date;
}
@Component({
  selector: 'app-students',
  imports: [CommonModule, TableDemoComponent],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
})
export class StudentsComponent {
  // users: User[] = [
  //   {
  //     id: 1,
  //     name: 'John Doe',
  //     email: 'john@example.com',
  //     role: 'Admin',
  //     status: 'active',
  //     lastLogin: new Date(2023, 8, 15),
  //   },
  //   {
  //     id: 2,
  //     name: 'Jane Smith',
  //     email: 'jane@example.com',
  //     role: 'User',
  //     status: 'active',
  //     lastLogin: new Date(2023, 8, 20),
  //   },
  //   {
  //     id: 3,
  //     name: 'Bob Johnson',
  //     email: 'bob@example.com',
  //     role: 'Editor',
  //     status: 'inactive',
  //     lastLogin: new Date(2023, 7, 25),
  //   },
  //   {
  //     id: 4,
  //     name: 'Alice Williams',
  //     email: 'alice@example.com',
  //     role: 'User',
  //     status: 'pending',
  //     lastLogin: new Date(2023, 8, 1),
  //   },
  //   {
  //     id: 5,
  //     name: 'Charlie Brown',
  //     email: 'charlie@example.com',
  //     role: 'Admin',
  //     status: 'active',
  //     lastLogin: new Date(2023, 8, 18),
  //   },
  //   {
  //     id: 6,
  //     name: 'Diana Prince',
  //     email: 'diana@example.com',
  //     role: 'Editor',
  //     status: 'active',
  //     lastLogin: new Date(2023, 8, 10),
  //   },
  //   {
  //     id: 7,
  //     name: 'Edward Miller',
  //     email: 'edward@example.com',
  //     role: 'User',
  //     status: 'inactive',
  //     lastLogin: new Date(2023, 6, 5),
  //   },
  //   {
  //     id: 8,
  //     name: 'Fiona Carter',
  //     email: 'fiona@example.com',
  //     role: 'User',
  //     status: 'active',
  //     lastLogin: new Date(2023, 8, 12),
  //   },
  //   {
  //     id: 9,
  //     name: 'George Wilson',
  //     email: 'george@example.com',
  //     role: 'Editor',
  //     status: 'pending',
  //     lastLogin: new Date(2023, 8, 3),
  //   },
  //   {
  //     id: 10,
  //     name: 'Helen Davis',
  //     email: 'helen@example.com',
  //     role: 'Admin',
  //     status: 'active',
  //     lastLogin: new Date(2023, 8, 22),
  //   },
  //   {
  //     id: 11,
  //     name: 'Ian Lewis',
  //     email: 'ian@example.com',
  //     role: 'User',
  //     status: 'active',
  //     lastLogin: new Date(2023, 8, 19),
  //   },
  //   {
  //     id: 12,
  //     name: 'Julia Martin',
  //     email: 'julia@example.com',
  //     role: 'User',
  //     status: 'inactive',
  //     lastLogin: new Date(2023, 7, 29),
  //   },
  // ];

  // selectedUsers: User[] = [];

  // basicTableConfig: TableConfig<User> = {
  //   columns: [
  //     { field: 'id', header: 'ID', sortable: true },
  //     { field: 'name', header: 'Name', sortable: true },
  //     { field: 'email', header: 'Email', sortable: true },
  //     { field: 'role', header: 'Role', sortable: true },
  //   ],
  //   uniqueIdField: 'id',
  //   enableSorting: true,
  //   enablePagination: true,
  //   sortConfig: {
  //     active: 'name',
  //     direction: 'asc',
  //   },
  //   paginationConfig: {
  //     total: this.users.length,
  //     page: 1,
  //     pageSize: 5,
  //   },
  // };

  // advancedTableConfig!: TableConfig<User>;

  // ngAfterViewInit() {
  //   // Need to set this after view init to get the template references
  //   this.advancedTableConfig = {
  //     columns: [
  //       { field: 'id', header: 'ID', sortable: true, width: '80px' },
  //       { field: 'name', header: 'Name', sortable: true, searchable: true },
  //       { field: 'email', header: 'Email', sortable: true, searchable: true },
  //       { field: 'role', header: 'Role', sortable: true, searchable: true },
  //       {
  //         field: 'status',
  //         header: 'Status',
  //         sortable: true,
  //         cellTemplate: this.statusTemplate,
  //       },
  //       {
  //         field: 'lastLogin',
  //         header: 'Last Login',
  //         sortable: true,
  //         cellTemplate: this.dateTemplate,
  //       },
  //     ],
  //     uniqueIdField: 'id',
  //     enableSorting: true,
  //     enableSearch: true,
  //     enableSelection: true,
  //     enablePagination: true,
  //     enableActions: true,
  //     sortConfig: {
  //       active: 'name',
  //       direction: 'asc',
  //     },
  //     searchConfig: {
  //       term: '',
  //       fields: ['name', 'email', 'role'],
  //       caseSensitive: false,
  //     },
  //     selectionConfig: {
  //       mode: 'multiple',
  //       selectedItems: this.selectedUsers,
  //     },
  //     paginationConfig: {
  //       total: this.users.length,
  //       page: 1,
  //       pageSize: 5,
  //     },
  //     actionsConfig: {
  //       actions: [
  //         {
  //           type: 'view',
  //           label: 'View',
  //           icon: 'fa-eye',
  //           handler: (user) => this.viewUser(user),
  //         },
  //         {
  //           type: 'edit',
  //           label: 'Edit',
  //           icon: 'fa-edit',
  //           handler: (user) => this.editUser(user),
  //         },
  //         {
  //           type: 'delete',
  //           label: 'Delete',
  //           icon: 'fa-trash',
  //           isDisabled: (user) => user.role === 'Admin', // Disable for Admin users
  //           handler: (user) => this.deleteUser(user),
  //         },
  //       ],
  //       showLabels: true,
  //     },
  //   };
  // }

  // onTableEvent(event: TableEvent<User>): void {
  //   console.log('Table event:', event.type, event.payload);

  //   // Handle pagination config updates
  //   if (event.type === 'page' || event.type === 'pageSize') {
  //     // Create the updated pagination config
  //     const paginationConfig: PaginationInfo = {
  //       ...this.basicTableConfig.paginationConfig!,
  //       total: this.users.length, // Ensure total is always set
  //     };

  //     // Update specific properties based on event type
  //     if (event.type === 'page') {
  //       paginationConfig.page = event.payload.page;
  //     } else if (event.type === 'pageSize') {
  //       paginationConfig.pageSize = event.payload.pageSize;
  //       paginationConfig.page = 1; // Reset to first page when changing page size
  //     }

  //     // Update the config
  //     this.basicTableConfig = {
  //       ...this.basicTableConfig,
  //       paginationConfig,
  //     };
  //   }

  //   // Handle sorting
  //   if (event.type === 'sort') {
  //     this.basicTableConfig = {
  //       ...this.basicTableConfig,
  //       sortConfig: {
  //         active: event.payload.field,
  //         direction: event.payload.direction,
  //       },
  //     };
  //   }
  // }

  // onAdvancedTableEvent(event: TableEvent<User>): void {
  //   console.log('Advanced table event:', event.type, event.payload);

  //   // Update selected users when selection changes
  //   if (event.type === 'select') {
  //     this.selectedUsers = event.payload;
  //   }

  //   // Update pagination config
  //   if (event.type === 'page' || event.type === 'pageSize') {
  //     // Create the updated pagination config
  //     const paginationConfig: PaginationInfo = {
  //       ...this.advancedTableConfig.paginationConfig!,
  //       total: this.users.length, // Ensure total is always set
  //     };

  //     // Update specific properties based on event type
  //     if (event.type === 'page') {
  //       paginationConfig.page = event.payload.page;
  //     } else if (event.type === 'pageSize') {
  //       paginationConfig.pageSize = event.payload.pageSize;
  //       paginationConfig.page = 1; // Reset to first page when changing page size
  //     }

  //     // Update the config
  //     this.advancedTableConfig = {
  //       ...this.advancedTableConfig,
  //       paginationConfig,
  //     };
  //   }

  //   // Update search config
  //   if (event.type === 'search') {
  //     this.advancedTableConfig = {
  //       ...this.advancedTableConfig,
  //       searchConfig: event.payload,
  //     };
  //   }

  //   // Update sorting config
  //   if (event.type === 'sort') {
  //     this.advancedTableConfig = {
  //       ...this.advancedTableConfig,
  //       sortConfig: {
  //         active: event.payload.field,
  //         direction: event.payload.direction,
  //       },
  //     };
  //   }
  // }

  // clearSelection(): void {
  //   this.selectedUsers = [];
  //   this.advancedTableConfig = {
  //     ...this.advancedTableConfig,
  //     selectionConfig: {
  //       ...this.advancedTableConfig.selectionConfig,
  //       selectedItems: [],
  //     },
  //   };
  // }

  // // Action handlers
  // viewUser(user: User): void {
  //   console.log('View user:', user);
  //   alert(`Viewing user: ${user.name}`);
  // }

  // editUser(user: User): void {
  //   console.log('Edit user:', user);
  //   alert(`Editing user: ${user.name}`);
  // }

  // deleteUser(user: User): void {
  //   console.log('Delete user:', user);
  //   if (confirm(`Are you sure you want to delete ${user.name}?`)) {
  //     // Remove user from the array
  //     this.users = this.users.filter((u) => u.id !== user.id);

  //     // Update both configs with new total
  //     if (this.basicTableConfig.paginationConfig) {
  //       this.basicTableConfig = {
  //         ...this.basicTableConfig,
  //         paginationConfig: {
  //           ...this.basicTableConfig.paginationConfig,
  //           total: this.users.length,
  //         },
  //       };
  //     }

  //     if (this.advancedTableConfig.paginationConfig) {
  //       this.advancedTableConfig = {
  //         ...this.advancedTableConfig,
  //         paginationConfig: {
  //           ...this.advancedTableConfig.paginationConfig,
  //           total: this.users.length,
  //         },
  //       };
  //     }

  //     // Also remove from selection if selected
  //     if (this.selectedUsers.some((u) => u.id === user.id)) {
  //       this.selectedUsers = this.selectedUsers.filter((u) => u.id !== user.id);
  //     }
  //   }
  // }
}
