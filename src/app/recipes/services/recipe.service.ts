import { Store } from '@ngrx/store';
import { Recipe } from 'app/recipes/models/recipe.model';
import { Ingredient } from 'app/shared/ingredient.model';
import { Subject } from 'rxjs';
import * as ShoppingListActions from 'app/shopping/store/shopping-list.actions';
import { Injectable } from '@angular/core';
import * as fromApp from '../../store/app.reducer';
@Injectable()
export class RecipeService {
  recipesChnaged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];
  constructor(private store: Store<fromApp.AppState>) {}

  getRecipes() {
    return this.recipes.slice();
  }
  getRecipe(id: string) {
    return this.recipes[+id];
  }
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChnaged.next(this.recipes.slice());
  }
  updateRecipe(index, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChnaged.next(this.recipes.slice());
  }
  removeRecipe(recipe: Recipe) {
    let index = this.recipes.indexOf(recipe);
    this.recipes.splice(index);
  }
  editRecipe(recipe: Recipe) {
    let index = this.recipes.indexOf(recipe);
    this.recipes[index] = recipe;
  }
  deleteRecipe(recipeIndex) {
    this.recipes.splice(recipeIndex, 1);
    this.recipesChnaged.next(this.recipes.slice());
  }
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChnaged.next(this.recipes.slice());
  }
  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }
}
