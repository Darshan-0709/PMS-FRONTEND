import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { AuthService } from '../../../../core/services/auth.service';
import { PlacementCellProfileComponent } from '../../components/placement-cell-profile/placement-cell-profile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PlacementCellProfileComponent, ToastComponent],
  template: `
  @if(placementCellId){
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-semibold mb-6">Recruiter Profile</h1>
      <app-placement-cell-profile
      [placementCellId]="placementCellId"
      ></app-placement-cell-profile>
      <app-toast></app-toast>
    </div>
  }
  `,
  styles: [],
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  placementCellId: string = '';

  ngOnInit(): void {
    // Get current user ID from auth service
    const currentUser = this.authService.user();
    if (currentUser && currentUser.placementCellId) {
      this.placementCellId = currentUser.placementCellId; // Fallback to mock ID
    }
  }
}
