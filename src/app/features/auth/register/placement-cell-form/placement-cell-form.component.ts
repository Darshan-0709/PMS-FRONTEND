import { Component, output } from '@angular/core';

@Component({
  selector: 'app-placement-cell-form',
  imports: [],
  templateUrl: './placement-cell-form.component.html',
  styleUrl: './placement-cell-form.component.css',
})
export class PlacementCellFormComponent {
  registrationSuccess = output<{ message: string }>();
}
