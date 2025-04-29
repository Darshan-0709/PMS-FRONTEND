import {
  Component,
  computed,
  input,
  OnInit,
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
export class AutoCompleteComponent implements OnInit {
  options = input<string[]>([]);
  placeHolder = input<string>('');

  inputValue: WritableSignal<string> = signal('');
  selectedValue: WritableSignal<string | null> = signal(null);
  isDropdownOpen: WritableSignal<boolean> = signal(true);

  filteredOptions: Signal<string[]> = computed(() => {
    const options = this.options() ?? [];
    return options.filter((opt) =>
      opt.toLowerCase().includes(this.inputValue().toLowerCase())
    );
  });

  selectOption(option: string) {
    console.log(option);
    this.inputValue.set(option);
    this.selectedValue.set(option);
    this.isDropdownOpen.set(false);
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.inputValue.set(value);
    this.isDropdownOpen.set(true);
  }
  ngOnInit(): void {
    console.log({ Options: this.options });
  }

  onBlur() {
    setTimeout(() => this.isDropdownOpen.set(false), 200);
  }
}
