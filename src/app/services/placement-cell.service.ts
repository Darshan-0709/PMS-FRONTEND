import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { PlacementCell, PlacementCellUpdateRequest } from '../types/placement-cell.types';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';

@Injectable({
  providedIn: 'root',
})
export class PlacementCellService {
  private api = inject(ApiService);

  getPlacementCell(id: string): Observable<PlacementCell> {
    return this.api.get<PlacementCell>(`placement-cells/${id}`).pipe(
      map(response => {
        console.log(response);
        return response.data;
      })
    );
  }

  updatePlacementCell(
    id: string,
    updateData: PlacementCellUpdateRequest
  ): Observable<PlacementCell> {
    const response = this.api.put<PlacementCell, PlacementCellUpdateRequest>(
      `placement-cells/${id}`,
      updateData
    );
    const placementCell = response.pipe(
      map(response => response.data),
      catchError(err => {
        if (err.error?.errors) {
          return throwError(() => err.error.errors);
        }
        return throwError(() => err);
      })
    );
    return placementCell;
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
