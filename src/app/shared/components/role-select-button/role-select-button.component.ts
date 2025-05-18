import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-role-select-button',
  imports: [CommonModule],
  templateUrl: './role-select-button.component.html',
  styleUrl: './role-select-button.component.css',
})
export class RoleSelectButtonComponent {
  label = input.required<string>();
  role = input.required<'student' | 'placement_cell' | 'recruiter'>();
  classes = input<string>('');
  roleSelected = output<'student' | 'placement_cell' | 'recruiter'>();

  selectRole() {
    this.roleSelected.emit(this.role());
  }
}
