import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataStorageService } from 'app/shared/data-storage.service';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

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
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.store.select('auth').subscribe((userState) => {
      this.isAuthenticated = userState.user ? true : false;
    });
  }

  onSaveData() {
    this.dataStorage.saveRecipes();
  }

  onFetchData() {
    //this.dataStorage.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.GetRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
