import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

export type SortDirection = 'asc' | 'desc';

@Directive({
  selector: '[appSortableHeader]',
})
export class SortableHeaderDirective<T> {
  @Input('appSortableHeader') column!: keyof T;
  @Input() currentSort: { field: keyof T | null; direction: SortDirection } = {
    field: null,
    direction: 'asc',
  };
  @Output() sortChange = new EventEmitter<{
    field: keyof T;
    direction: SortDirection;
  }>();

  @HostListener('click')
  onClick() {
    if (!this.column) return; // skip sorting if not a sortable column

    const newDirection =
      this.currentSort.field === this.column &&
      this.currentSort.direction === 'asc'
        ? 'desc'
        : 'asc';

    this.sortChange.emit({ field: this.column, direction: newDirection });
  }
}
