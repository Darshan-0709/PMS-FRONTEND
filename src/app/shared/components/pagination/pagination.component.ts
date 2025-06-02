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

export interface PaginationInfo {
  total: number; // Total number of items
  page: number; // Current page (1-based)
  pageSize: number; // Items per page
  totalPages?: number; // Optional: total pages (calculated if not provided)
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  @Input() pagination!: PaginationInfo;
  @Input() visiblePages: number = 5; // Number of page buttons to show
  @Input() showFirstLast: boolean = true;
  @Input() showPrevNext: boolean = true;
  @Input() ariaLabel: string = 'Pagination';
  @Input() showTotal: boolean = true;
  @Input() showPageSize: boolean = false;
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  // Make Math available to the template
  protected Math = Math;

  // Compute array of page numbers to display
  displayedPages = computed(() => {
    const totalPgs = this.totalPages();
    const current = this.currentPage();

    if (totalPgs <= this.visiblePages) {
      // If we have fewer pages than the visible count, show all pages
      return Array.from({ length: totalPgs }, (_, i) => i + 1);
    }

    // Calculate the range to show
    const halfVisible = Math.floor(this.visiblePages / 2);
    let start = Math.max(current - halfVisible, 1);
    const end = Math.min(start + this.visiblePages - 1, totalPgs);

    // Adjust start if we're near the end
    if (end === totalPgs) {
      start = Math.max(end - this.visiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  // Reactive states for button enabled/disabled
  hasNext = computed(() => this.currentPage() < this.totalPages());
  hasPrev = computed(() => this.currentPage() > 1);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pagination']) {
      this.updatePagination();
    }
  }

  private updatePagination(): void {
    if (!this.pagination) return;

    // Set current page from input
    this.currentPage.set(this.pagination.page || 1);

    // Calculate total pages if not provided
    const calculatedTotal =
      this.pagination.totalPages || Math.ceil(this.pagination.total / this.pagination.pageSize);
    this.totalPages.set(Math.max(calculatedTotal, 1)); // Ensure at least 1 page
  }

  // Navigation methods
  goToPage(page: number): void {
    if (page === this.currentPage() || page < 1 || page > this.totalPages()) {
      return; // Don't do anything if trying to go to current page or invalid page
    }

    this.currentPage.set(page);
    this.pageChange.emit(page);
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages());
  }

  goToPreviousPage(): void {
    if (this.hasPrev()) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  goToNextPage(): void {
    if (this.hasNext()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  changePageSize(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newSize = parseInt(select.value, 10);

    if (newSize !== this.pagination.pageSize) {
      this.pageSizeChange.emit(newSize);
    }
  }

  // Helper to track items by their index in ngFor
  trackByIndex(index: number): number {
    return index;
  }
}
