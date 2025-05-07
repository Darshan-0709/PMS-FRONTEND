import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlacementCellProfileComponent } from '../../components/placement-cell-profile/placement-cell-profile.component';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PlacementCellProfileComponent, ToastComponent],
  templateUrl: "profile.component.html",
  styles: [],
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  currentUserId: string = '';

  ngOnInit(): void {
    // Get current user ID from auth service
    const currentUser = this.authService.user();
    if (currentUser) {
      this.currentUserId = currentUser.placementCellId || '123'; // Fallback to mock ID
    } else {
      // Use a mock ID if no user is found
      this.currentUserId = '123';
    }
  }
}
