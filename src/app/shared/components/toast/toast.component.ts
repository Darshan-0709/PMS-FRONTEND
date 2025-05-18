import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-50 flex flex-col gap-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="shadow-md rounded-md p-4 transition-all transform animate-slide-in-right min-w-80 flex justify-between"
          [ngClass]="getToastClass(toast)"
        >
          <span class="text-sm">{{ toast.message }}</span>
          <button
            class="ml-4 text-sm font-semibold hover:text-opacity-80"
            (click)="toastService.remove(toast.id)"
          >
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .animate-slide-in-right {
        animation: slideInRight 0.3s ease-out forwards;
      }
    `,
  ],
})
export class ToastComponent {
  toastService = inject(ToastService);

  getToastClass(toast: Toast): string {
    switch (toast.type) {
      case 'success':
        return 'bg-[color:var(--color-success-bg-light)] text-[color:var(--color-success-text-light)]';
      case 'error':
        return 'bg-[color:var(--color-danger-bg-light)] text-[color:var(--color-danger-text-light)]';
      case 'warning':
        return 'bg-[color:var(--color-warning-bg-light)] text-[color:var(--color-warning-text-light)]';
      case 'info':
      default:
        return 'bg-[color:var(--color-info-bg-light)] text-[color:var(--color-info-text-light)]';
    }
  }
}
