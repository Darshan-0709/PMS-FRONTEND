import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  imports: [CommonModule],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.css',
})
export class AlertModalComponent {
  message = input.required<string>();
  type = input.required<'success' | 'error' | 'warning' | 'info'>();
  show = input.required<boolean>();
  onConfirm = output<void>();
  onClose = output<void>();

  confirm() {
    this.onConfirm.emit();
  }

  close() {
    this.onClose.emit();
  }
}
