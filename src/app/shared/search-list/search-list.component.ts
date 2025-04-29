import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-search-list',
  imports: [],
  templateUrl: './search-list.component.html',
  styleUrl: './search-list.component.css',
})
export class SearchListComponent {
  options = input.required<any[]>();
  searchPrefix = input('');
  optionDisplay = input.required<string>();
  optionValue = input.required<string>();
  filteredOptions = signal<any[]>([]);
  selectedValue = output<string>();

  filterOptions(searchPrefix: string) {
    this.filteredOptions.update((oldOptions) =>
      oldOptions.filter(
        (option) => option[this.optionDisplay()] === searchPrefix
      )
    );
  }
  constructor() {
    effect(() => {
      const prefix = this.searchPrefix().toLowerCase();
      const list = this.options();
      const displayKey = this.optionDisplay();

      if (list?.length)
        this.filteredOptions.set(
          list.filter((option) =>
            String(option[displayKey])
              .toLowerCase()
              .startsWith(prefix.toLowerCase())
          )
        );
    });
  }

  onSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target?.value ?? '';
    this.selectedValue.emit(value);
  }
}
