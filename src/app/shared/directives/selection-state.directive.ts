import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  input,
  Output,
  output,
} from '@angular/core';

@Directive({
  selector: '[appRowSelectable]',
})
export class SelectionStateDirective<T> {
  @Input('appRowSelectable') rowData!: T;
  @Input() selectedItems: T[] = [];
  @Output() selectionChange = new EventEmitter<T[]>();

  @HostBinding('class.selected')
  get isSelected(): boolean {
    return this.selectedItems.includes(this.rowData);
  }

  @HostListener('click')
  onRowClick() {
    this.toggleSelection();
  }

  private toggleSelection() {
    const idx = this.selectedItems.indexOf(this.rowData);
    if (idx === -1) {
      this.selectedItems.push(this.rowData);
    } else {
      this.selectedItems.splice(idx, 1);
    }
    this.selectionChange.emit([...this.selectedItems]);
  }
}
