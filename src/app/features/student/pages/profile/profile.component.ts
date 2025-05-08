import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentProfileComponent } from '../../../../shared/components/student-profile/student-profile.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, StudentProfileComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-semibold mb-6">My Profile</h1>
      @if (currentUserId) {
      <app-student-profile
        [studentId]="currentUserId"
        [isPlacementCellView]="false"
      >
      </app-student-profile>
      } @else {
      <div
        class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4"
      >
        <p>
          Could not retrieve your profile information. Please try logging out
          and logging in again.
        </p>
      </div>
      }
    </div>
  `,
  styles: [],
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  currentUserId: string = '';

  ngOnInit(): void {
    // Get current user ID from auth service
    const currentUser = this.authService.user();

    if (currentUser && currentUser.studentId) {
      console.log('Profile: Found student ID:', currentUser.studentId);
      this.currentUserId = currentUser.studentId;
    } else {
      console.error(
        'Profile: No student ID found in user object:',
        currentUser
      );
      // Don't set a fallback ID - let the template handle this case
    }
  }
}
