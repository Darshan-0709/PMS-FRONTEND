import { Component, Input } from '@angular/core';

@Component({
  selector: 'button[dfButton], a[dfButton]',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() color: 'primary' | 'secondary' | 'danger' | 'success' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get btnClass(): string[] {
    return ['btn', `btn-${this.color}`, `btn-${this.size}`];
  }
}
