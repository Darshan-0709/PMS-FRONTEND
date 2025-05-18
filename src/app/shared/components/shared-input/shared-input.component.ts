import { CommonModule } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './shared-input.component.html',
  styleUrl: './shared-input.component.css',
})
export class SharedInputComponent {
  control = input.required<FormControl>();
  label = input.required<string>();
  type = input<string>('text');
  placeholder = input<string>('');
  readonly = input<boolean>(false);
  // constructor(){
  //   effect(()=> {
  //     this.readonly()
  //   })
  // }
}
