import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
export interface SelectOption<T> {
  label: string;
  value: T;
  select?: boolean;
}
@Component({
  selector: 'app-custom-select-dropdown',
  imports: [FormsModule],
  templateUrl: './custom-select-dropdown.component.html',
  styleUrl: './custom-select-dropdown.component.css',
})
export class CustomSelectDropdownComponent<T> {
  // Inputs
  options = input.required<SelectOption<T>[]>();
  title = input<string>();
  canSearch = input<boolean>(false);
  placeholder = input<string>('Select…');
  selectedValue = input<T | null>(null);

  canEmitValue = input<boolean>(false);
  // Internal signals
  query = signal<string>('');
  open = signal(false);

  // Output
  added = output<string>();
  selection = output<T>();

  // Filtered list based on query
  filtered = computed(() => {
    if (!this.canSearch()) {
      return this.options();
    }
    return this.options().filter(o => o.label.toLowerCase().includes(this.query().toLowerCase()));
  });

  // Emit when a selection happens
  select(o: SelectOption<T>) {
    this.query.set(o.label);
    this.open.set(false);
    this.selection.emit(o.value);
  }

  // Update query as the user types
  onInput(e: Event) {
    if (!this.canSearch()) return;
    const val = (e.target as HTMLInputElement).value;
    this.query.set(val);
    this.open.set(true);
  }

  onAdd() {
    this.added.emit(this.query());
    this.open.set(false);
  }

  // Close on blur (allow click)
  onBlur() {
    setTimeout(() => this.open.set(false), 200);
  }

  get queryValue(): string {
    return this.query();
  }

  set queryValue(val: string) {
    this.query.set(val);
    if (this.canSearch()) {
      this.open.set(true);
    }
  }
}
