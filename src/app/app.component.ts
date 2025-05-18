import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
      <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'PMS-Frontend';
}
