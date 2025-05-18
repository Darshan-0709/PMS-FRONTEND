import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../types/api-response.types';
import { Branch, Degree, PlacementCellListItem } from '../types/common.types';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private api = inject(ApiService);

  getBranches(): Observable<ApiResponse<Branch[]>> {
    return this.api.get<Branch[]>('branches');
  }

  getDegrees(): Observable<ApiResponse<Degree[]>> {
    return this.api.get<Degree[]>('degrees');
  }

  getPlacementCellsList(): Observable<ApiResponse<PlacementCellListItem[]>> {
    return this.api.get<PlacementCellListItem[]>('placement_cells_list');
  }

  // Method to get detailed placement cell information
  getPlacementCellDetails(id: string): Observable<ApiResponse<any>> {
    return this.api.get<any>(`placement-cells/${id}`);
  }
}
