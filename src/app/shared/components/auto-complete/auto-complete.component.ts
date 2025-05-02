import {
  Component,
  computed,
  input,
  OnInit,
  output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

@Component({
  selector: 'app-auto-complete',
  imports: [],
  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.css',
})
export class AutoCompleteComponent<T> {
  // Inputs
  options = input.required<SelectOption<T>[]>();    // full list
  placeholder = input<string>('Select…');

  // Internal signals
  query = signal<string>('');
  open = signal(false);

  // Output
  selection = output<T>();

  // Filtered list based on query
  filtered = computed(() =>
    this.options()
      .filter(o => o.label.toLowerCase().includes(this.query().toLowerCase()))
  );

  // Emit when a selection happens
  select(o: SelectOption<T>) {
    this.query.set(o.label);
    this.open.set(false);
    this.selection.emit(o.value);
  }

  // Update query as the user types
  onInput(e: Event) {
    this.query.set((e.target as HTMLInputElement).value);
    this.open.set(true);
  }

  // Close on blur (allow click)
  onBlur() {
    setTimeout(() => this.open.set(false), 200);
  }
}

export interface SelectOption<T> {
  label: string;
  value: T;
}