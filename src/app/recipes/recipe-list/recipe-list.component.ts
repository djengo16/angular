import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { Recipe } from '../models/recipe.model';
import * as fromApp from '../../store/app.reducer';
import { __values } from 'tslib';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  recipes: Recipe[] = [];
  private recipesSubscription: Subscription;
  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.recipesSubscription = this.store
      .select('recipes')
      .pipe(
        map((recipesState) => {
          return recipesState.recipes;
        })
      )
      .subscribe((recipes) => {
        this.recipes = recipes;
      });
  }

  ngOnDestroy(): void {
    this.recipesSubscription.unsubscribe();
  }
}
