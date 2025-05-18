import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">{{ title }}</h1>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'PMS-Frontend';
}
