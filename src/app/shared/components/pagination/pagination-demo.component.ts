import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent, PaginationInfo } from './pagination.component';

@Component({
  selector: 'app-pagination-demo',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-2xl font-bold mb-4">Pagination Component Demo</h1>

      <div class="bg-white p-6 rounded-lg shadow mb-8">
        <h2 class="text-lg font-semibold mb-4">Default Pagination</h2>
        <app-pagination
          [pagination]="paginationConfig"
          (pageChange)="onPageChange($event)"
        ></app-pagination>

        <div class="mt-4 p-4 bg-gray-50 rounded">
          <p class="text-sm text-gray-600">Current page: {{ paginationConfig.page }}</p>
          <p class="text-sm text-gray-600">Total pages: {{ totalPages }}</p>
          <p class="text-sm text-gray-600">Items per page: {{ paginationConfig.pageSize }}</p>
          <p class="text-sm text-gray-600">Total items: {{ paginationConfig.total }}</p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow mb-8">
        <h2 class="text-lg font-semibold mb-4">With Page Size Selector</h2>
        <app-pagination
          [pagination]="paginationWithPageSizeConfig"
          [showPageSize]="true"
          (pageChange)="onPageChangeSample2($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        ></app-pagination>

        <div class="mt-4 p-4 bg-gray-50 rounded">
          <p class="text-sm text-gray-600">Current page: {{ paginationWithPageSizeConfig.page }}</p>
          <p class="text-sm text-gray-600">
            Items per page: {{ paginationWithPageSizeConfig.pageSize }}
          </p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Compact Pagination (Without Total & First/Last)</h2>
        <app-pagination
          [pagination]="compactPaginationConfig"
          [showTotal]="false"
          [showFirstLast]="false"
          (pageChange)="onPageChangeSample3($event)"
        ></app-pagination>
      </div>
    </div>
  `,
})
export class PaginationDemoComponent {
  // Example pagination configurations
  paginationConfig: PaginationInfo = {
    total: 100,
    page: 1,
    pageSize: 10,
  };

  paginationWithPageSizeConfig: PaginationInfo = {
    total: 250,
    page: 1,
    pageSize: 25,
  };

  compactPaginationConfig: PaginationInfo = {
    total: 60,
    page: 1,
    pageSize: 10,
  };

  // Computed property
  get totalPages(): number {
    return Math.ceil(this.paginationConfig.total / this.paginationConfig.pageSize);
  }

  // Event handlers
  onPageChange(page: number): void {
    this.paginationConfig = {
      ...this.paginationConfig,
      page,
    };
  }

  onPageChangeSample2(page: number): void {
    this.paginationWithPageSizeConfig = {
      ...this.paginationWithPageSizeConfig,
      page,
    };
  }

  onPageChangeSample3(page: number): void {
    this.compactPaginationConfig = {
      ...this.compactPaginationConfig,
      page,
    };
  }

  onPageSizeChange(pageSize: number): void {
    // Calculate the first item index on the current page
    const firstItemIndex =
      (this.paginationWithPageSizeConfig.page - 1) * this.paginationWithPageSizeConfig.pageSize;

    // Calculate the new page number to keep the user at approximately the same position
    const newPage = Math.floor(firstItemIndex / pageSize) + 1;

    this.paginationWithPageSizeConfig = {
      ...this.paginationWithPageSizeConfig,
      pageSize,
      page: newPage,
    };
  }
}
