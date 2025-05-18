import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select-all-header',
  imports: [],
  templateUrl: './select-all-header.component.html',
  styleUrl: './select-all-header.component.css',
})
export class SelectAllHeaderComponent<T> {
  @Input() data: T[] = [];
  @Input() selectedItems: T[] = [];
  @Output() selectAllChange = new EventEmitter<T[]>();

  get allSelected(): boolean {
    return (
      this.data.length > 0 && this.selectedItems.length === this.data.length
    );
  }

  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const newSelection = checked ? [...this.data] : [];
    this.selectAllChange.emit(newSelection);
  }
}
