import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { PlacementCell, PlacementCellUpdateRequest } from '../types/placement-cell.types';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';

@Injectable({
  providedIn: 'root',
})
export class PlacementCellService {
  private api = inject(ApiService);

  getPlacementCell(id: string): Observable<ApiResponse<PlacementCell>> {
    return this.api.get<PlacementCell>(`placement-cells/${id}`);
  }

  updatePlacementCell(
    id: string,
    updateData: PlacementCellUpdateRequest
  ): Observable<ApiResponse<PlacementCell>> {
    return this.api.patch<PlacementCell>(`placement-cells/${id}`, updateData);
  }

  deletePlacementCell(id: string): Observable<ApiResponse<null>> {
    return this.api.delete<null>(`placement-cells/${id}`);
  }

  getStudentPlacementCell(): Observable<ApiResponse<PlacementCell>> {
    return this.api.get<PlacementCell>('placement-cells/student/placement-cell');
  }

  getPlacementCellsList(): Observable<
    ApiResponse<{ placementCellId: string; placementCellName: string }[]>
  > {
    return this.api.get<{ placementCellId: string; placementCellName: string }[]>(
      'placement_cells_list'
    );
  }
}
