import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'app/auth/auth.service';
import { DataStorageService } from 'app/shared/data-storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  collapsed = true;
  isAuthenticated = false;
  private userSubscription: Subscription;
  constructor(
    private dataStorage: DataStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe((user) => {
      this.isAuthenticated = user ? true : false;
    });
  }

  onSaveData() {
    this.dataStorage.saveRecipes();
  }
  onFetchData() {
    this.dataStorage.fetchRecipes().subscribe();
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
