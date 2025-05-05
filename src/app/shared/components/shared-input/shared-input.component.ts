import { Component, effect, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './shared-input.component.html',
  styleUrl: './shared-input.component.css',
})
export class SharedInputComponent {
  control = input.required<FormControl>();
  label = input.required<string>();
  type = input<string>('text');
  placeholder = input<string>('');
}
