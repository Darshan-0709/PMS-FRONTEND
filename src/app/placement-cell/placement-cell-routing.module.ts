import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PLACEMENT_CELL_ROUTES } from './placement-cell.routes';

@NgModule({
  imports: [RouterModule.forChild(PLACEMENT_CELL_ROUTES)],
  exports: [RouterModule],
})
export class PlacementCellRoutingModule {}
