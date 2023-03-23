import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Ingredient } from 'app/shared/ingredient.model';
import { map, Subscription, switchMap } from 'rxjs';
import { Recipe } from '../models/recipe.model';

import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent {
  recipe: Recipe;
  recipeSubscription: Subscription;
  recipeIndex: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params) => {
          return +params['id'];
        }),
        switchMap((id) => {
          this.recipeIndex = id;
          return this.store.select('recipes');
        }),
        map((recipesState) => {
          return recipesState.recipes.find((recipe, index) => {
            return index === this.recipeIndex;
          });
        })
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });
  }

  onAddIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  onRecipeDelete() {
    this.store.dispatch(new RecipeActions.RemoveRecipe(this.recipeIndex));
    this.router.navigate(['/recipes']);
  }
}
