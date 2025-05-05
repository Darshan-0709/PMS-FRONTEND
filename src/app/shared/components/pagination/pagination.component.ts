import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaginationConfig {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container" *ngIf="config">
      <div class="pagination-info">
        Showing {{ startItem }}-{{ endItem }} of {{ config.total }} items
      </div>
      <div class="pagination-controls">
        <button
          class="pagination-button"
          [disabled]="config.page === 1"
          (click)="onPageChange(1)"
        >
          First
        </button>
        <button
          class="pagination-button"
          [disabled]="config.page === 1"
          (click)="onPageChange(config.page - 1)"
        >
          Previous
        </button>

        <div class="page-numbers">
          <button
            *ngFor="let page of getPageNumbers()"
            class="page-number"
            [class.active]="page === config.page"
            (click)="onPageChange(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="pagination-button"
          [disabled]="config.page === config.totalPages"
          (click)="onPageChange(config.page + 1)"
        >
          Next
        </button>
        <button
          class="pagination-button"
          [disabled]="config.page === config.totalPages"
          (click)="onPageChange(config.totalPages)"
        >
          Last
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .pagination-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
      }

      .pagination-info {
        color: #666;
        font-size: 0.875rem;
      }

      .pagination-controls {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      .pagination-button,
      .page-number {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .pagination-button:hover:not([disabled]),
      .page-number:hover:not(.active) {
        background: #f5f5f5;
      }

      .pagination-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .page-number {
        min-width: 2.5rem;
        text-align: center;
      }

      .page-number.active {
        background: #007bff;
        color: white;
        border-color: #007bff;
      }

      .page-numbers {
        display: flex;
        gap: 0.5rem;
      }
    `,
  ],
})
export class PaginationComponent {
  @Input() config: PaginationConfig | null = null;
  @Output() pageChange = new EventEmitter<number>();

  get startItem(): number {
    if (!this.config) return 0;
    return (this.config.page - 1) * this.config.pageSize + 1;
  }

  get endItem(): number {
    if (!this.config) return 0;
    return Math.min(this.config.page * this.config.pageSize, this.config.total);
  }

  getPageNumbers(): number[] {
    if (!this.config) return [];

    const currentPage = this.config.page;
    const totalPages = this.config.totalPages;
    const delta = 2; // Number of pages to show before and after current page
    const range: number[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift(-1); // Add ellipsis
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-1); // Add ellipsis
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  }

  onPageChange(page: number): void {
    if (page === -1) return; // Skip ellipsis clicks
    this.pageChange.emit(page);
  }
}
