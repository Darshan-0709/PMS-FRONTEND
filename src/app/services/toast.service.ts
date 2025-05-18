import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  message: string;
  type: ToastType;
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastCounter = 0;
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info'): void {
    const id = this.toastCounter++;
    const toast: Toast = { message, type, id };
    this.toasts.update(current => [...current, toast]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      this.remove(id);
    }, 5000);
  }

  remove(id: number): void {
    this.toasts.update(current => current.filter(toast => toast.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
