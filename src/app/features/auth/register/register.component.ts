import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
onSubmit() {
throw new Error('Method not implemented.');
}
  step = signal(1);

  onNextStep() {
    this.step.update((prevStep) => (prevStep === 3 ? 3 : prevStep + 1));
  }

  onPreviousStep() {
    this.step.update((prevStep) => prevStep - 1 || 1);
  }
}
