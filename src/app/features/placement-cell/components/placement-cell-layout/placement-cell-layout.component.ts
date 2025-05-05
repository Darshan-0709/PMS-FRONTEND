import { Component } from '@angular/core';
import { PlacementCellNavbarComponent } from '../navigation/navigation.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-placement-cell-layout',
  imports: [PlacementCellNavbarComponent, RouterModule],
  templateUrl: './placement-cell-layout.component.html',
  styleUrl: './placement-cell-layout.component.css',
})
export class PlacementCellLayoutComponent {}
